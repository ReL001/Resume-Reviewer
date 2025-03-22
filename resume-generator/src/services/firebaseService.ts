import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserDocument {
  id: string;
  userId: string;
  title: string;
  type: 'resume' | 'cover-letter';
  content: string;
  createdAt: Date;
  lastModified: Date;
  template: string;
}

export const saveDocument = async (
  userId: string,
  document: Omit<UserDocument, 'id' | 'userId' | 'createdAt' | 'lastModified'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'documents'), {
      ...document,
      userId,
      createdAt: Timestamp.now(),
      lastModified: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
};

export const getDocument = async (documentId: string): Promise<UserDocument | null> => {
  try {
    const docRef = doc(db, 'documents', documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId,
      title: data.title,
      type: data.type,
      content: data.content,
      createdAt: data.createdAt.toDate(),
      lastModified: data.lastModified.toDate(),
      template: data.template,
    };
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const getUserDocuments = async (userId: string): Promise<UserDocument[]> => {
  try {
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        type: data.type,
        content: data.content,
        createdAt: data.createdAt.toDate(),
        lastModified: data.lastModified.toDate(),
        template: data.template,
      };
    });
  } catch (error) {
    console.error('Error getting user documents:', error);
    throw error;
  }
};

export const updateDocument = async (
  documentId: string,
  updates: Partial<UserDocument>
): Promise<void> => {
  try {
    const docRef = doc(db, 'documents', documentId);
    await updateDoc(docRef, {
      ...updates,
      lastModified: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'documents', documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return userSnap.data().subscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    throw error;
  }
};

export const updateUserSubscription = async (
  userId: string,
  subscription: {
    planId: string;
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: Date;
  }
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      subscription: {
        ...subscription,
        currentPeriodEnd: Timestamp.fromDate(subscription.currentPeriodEnd),
      },
    });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}; 