import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrorHandler";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "Volunteer" | "Police" | "Admin";
  lastKnownLocation?: {
    lat: number;
    lng: number;
  };
  notificationEnabled: boolean;
  createdAt: string;
}

export const syncUserProfile = async (user: { uid: string, email: string | null, displayName: string | null }) => {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: UserProfile = {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || user.email?.split("@")[0] || "User",
        role: "Volunteer",
        notificationEnabled: true,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, newUser);
      return newUser;
    }

    return userSnap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const updateUserLocation = async (uid: string, lat: number, lng: number) => {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      lastKnownLocation: { lat, lng },
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

