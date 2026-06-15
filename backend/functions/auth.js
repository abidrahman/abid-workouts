import axios from 'axios';
import cors from 'cors';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';
import { config } from 'dotenv';

config();

const db = getFirestore();
const corsHandler = cors({ origin: true });

/**
 * Generate a secure state token to prevent CSRF attacks
 */
function generateStateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Handle OAuth2 authorization redirect to COROS
 * GET /auth/authorize
 */
async function handleAuthorizeRequest(req, res) {
  try {
    // Generate state token for CSRF protection
    const stateToken = generateStateToken();
    
    // Store state token in Firestore with expiration (10 minutes)
    const timestamp = new Date();
    await db.collection('oauth_states').doc(stateToken).set({
      created_at: timestamp,
      expires_at: new Date(timestamp.getTime() + 10 * 60 * 1000), // 10 min expiry
      used: false
    });

    // Build authorization URL
    const authorizationUrl = new URL(process.env.COROS_AUTH_URL);
    authorizationUrl.searchParams.append('client_id', process.env.COROS_CLIENT_ID);
    authorizationUrl.searchParams.append('redirect_uri', process.env.COROS_REDIRECT_URI);
    authorizationUrl.searchParams.append('response_type', 'code');
    authorizationUrl.searchParams.append('scope', 'activity:read metrics:read');
    authorizationUrl.searchParams.append('state', stateToken);

    // Redirect to COROS authorization endpoint
    res.redirect(authorizationUrl.toString());
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ 
      error: 'Authorization failed', 
      message: error.message 
    });
  }
}

/**
 * Handle OAuth2 callback from COROS
 * GET /auth/callback?code=...&state=...
 */
async function handleCallbackRequest(req, res) {
  const { code, state, error, error_description } = req.query;

  try {
    // Check for COROS errors
    if (error) {
      return res.status(400).json({ 
        error: error, 
        description: error_description || 'Unknown error from COROS' 
      });
    }

    // Validate required parameters
    if (!code || !state) {
      return res.status(400).json({ 
        error: 'Missing code or state parameter' 
      });
    }

    // Verify state token
    const stateDoc = await db.collection('oauth_states').doc(state).get();
    if (!stateDoc.exists) {
      return res.status(403).json({ 
        error: 'Invalid state token: state not found' 
      });
    }

    const stateData = stateDoc.data();
    
    // Check if state has expired
    if (new Date() > stateData.expires_at) {
      await db.collection('oauth_states').doc(state).delete();
      return res.status(403).json({ 
        error: 'State token expired' 
      });
    }

    // Check if state was already used
    if (stateData.used) {
      return res.status(403).json({ 
        error: 'State token already used (possible replay attack)' 
      });
    }

    // Mark state as used
    await db.collection('oauth_states').doc(state).update({ used: true });

    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    
    // Save tokens to Firestore
    const userId = tokenResponse.user_id || 'default'; // COROS API may return user_id
    await saveTokens(userId, tokenResponse);

    // Return success response (frontend will receive this)
    res.status(200).json({ 
      success: true, 
      message: 'Authentication successful',
      user_id: userId 
    });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ 
      error: 'Token exchange failed', 
      message: error.message 
    });
  }
}

/**
 * Exchange authorization code for access token with COROS
 */
async function exchangeCodeForToken(code) {
  try {
    const response = await axios.post(
      process.env.COROS_TOKEN_URL,
      {
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.COROS_CLIENT_ID,
        client_secret: process.env.COROS_CLIENT_SECRET,
        redirect_uri: process.env.COROS_REDIRECT_URI
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    throw new Error(`Failed to exchange code for token: ${error.message}`);
  }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(
      process.env.COROS_TOKEN_URL,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.COROS_CLIENT_ID,
        client_secret: process.env.COROS_CLIENT_SECRET
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    throw new Error(`Failed to refresh token: ${error.message}`);
  }
}

/**
 * Save tokens to Firestore
 * TODO: Implement encryption for tokens at rest if needed
 */
async function saveTokens(userId, tokenData) {
  try {
    const tokenDoc = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
      created_at: new Date(),
      expires_at: new Date(Date.now() + (tokenData.expires_in * 1000))
    };

    // Store in Firestore at users/{userId}/oauth
    await db.collection('users').doc(userId).collection('oauth').doc('coros').set(tokenDoc, { merge: true });

    console.log(`Tokens saved for user: ${userId}`);
  } catch (error) {
    console.error('Error saving tokens:', error);
    throw new Error(`Failed to save tokens: ${error.message}`);
  }
}

/**
 * Get valid access token for user (refresh if expired)
 */
export async function getValidAccessToken(userId) {
  try {
    const tokenDoc = await db
      .collection('users')
      .doc(userId)
      .collection('oauth')
      .doc('coros')
      .get();

    if (!tokenDoc.exists) {
      throw new Error('No COROS token found for user');
    }

    const tokenData = tokenDoc.data();

    // Check if token is expired
    if (new Date() >= new Date(tokenData.expires_at)) {
      console.log('Token expired, refreshing...');
      const newTokenData = await refreshAccessToken(tokenData.refresh_token);
      
      // Save refreshed token
      await saveTokens(userId, newTokenData);
      
      return newTokenData.access_token;
    }

    return tokenData.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

/**
 * Main handler function that routes OAuth requests
 */
export default function authHandler(req, res) {
  corsHandler(req, res, async () => {
    try {
      const action = req.query.action || req.body?.action;

      switch (action) {
        case 'authorize':
          await handleAuthorizeRequest(req, res);
          break;
        case 'callback':
          await handleCallbackRequest(req, res);
          break;
        default:
          // If no action, assume callback (from redirect)
          if (req.query.code || req.query.error) {
            await handleCallbackRequest(req, res);
          } else {
            res.status(400).json({ 
              error: 'Missing or invalid action parameter',
              valid_actions: ['authorize', 'callback']
            });
          }
      }
    } catch (error) {
      console.error('Unexpected error in auth handler:', error);
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message 
      });
    }
  });
}
