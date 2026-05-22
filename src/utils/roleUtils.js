import { db } from '../firebase/firebase.init';
import { doc, updateDoc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Set or update a user's role in Firestore
 * @param {string} uid - User ID
 * @param {string} role - Role to assign ('user', 'admin', 'moderator')
 * @returns {Promise<void>}
 */
export const setUserRole = async (uid, role) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role: role,
      roleUpdatedAt: new Date(),
    });
    console.log(`User role updated to: ${role}`);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Get user role from Firestore
 * @param {string} uid - User ID
 * @returns {Promise<string>} User role
 */
export const getUserRole = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data()?.role || 'user';
    }
    return 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
};

/**
 * Get all users with a specific role
 * @param {string} role - Role to filter by
 * @returns {Promise<Array>} Array of users with the specified role
 */
export const getUsersByRole = async (role) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', role));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users by role:', error);
    return [];
  }
};

/**
 * Check if user has admin role
 * @param {string} uid - User ID
 * @returns {Promise<boolean>}
 */
export const isUserAdmin = async (uid) => {
  const role = await getUserRole(uid);
  return role === 'admin';
};

/**
 * Check if user has moderator role
 * @param {string} uid - User ID
 * @returns {Promise<boolean>}
 */
export const isUserModerator = async (uid) => {
  const role = await getUserRole(uid);
  return role === 'moderator';
};

/**
 * Create user document with initial role
 * @param {string} uid - User ID
 * @param {string} email - User email
 * @param {string} role - Initial role (default: 'user')
 * @returns {Promise<void>}
 */
export const createUserDocument = async (uid, email, role = 'user') => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      uid: uid,
      email: email,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};
