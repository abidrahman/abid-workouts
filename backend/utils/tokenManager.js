import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

const db = getFirestore();

/**
 * Token management utilities
 * 
 * Provides functions for secure token storage and retrieval
 */

/**
 * Encrypt token (optional: for extra security)
 * TODO: Implement if TOKEN_ENCRYPTION_KEY is provided
 */
export function encryptToken(token, encryptionKey = null) {
  if (!encryptionKey || !process.env.TOKEN_ENCRYPTION_KEY) {
    // Return token as-is if encryption is not configured
    return token;
  }

  try {
    // This is a placeholder for encryption implementation
    // For production, use a proper encryption library like 'crypto'
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return token;
  }
}

/**
 * Decrypt token
 * TODO: Implement decryption if using encryption
 */
export function decryptToken(encryptedToken, encryptionKey = null) {
  if (!encryptionKey || !process.env.TOKEN_ENCRYPTION_KEY) {
    return encryptedToken;
  }

  try {
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Get tokens for a user
 */
export async function getTokens(userId) {
  try {
    const tokenDoc = await db
      .collection('users')
      .doc(userId)
      .collection('oauth')
      .doc('coros')
      .get();

    if (!tokenDoc.exists) {
      return null;
    }

    return tokenDoc.data();
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    throw error;
  }
}

/**
 * Clear tokens for a user (logout)
 */
export async function clearTokens(userId) {
  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('oauth')
      .doc('coros')
      .delete();
    
    console.log(`Tokens cleared for user: ${userId}`);
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated
 */
export async function isUserAuthenticated(userId) {
  try {
    const tokens = await getTokens(userId);
    return tokens !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}
