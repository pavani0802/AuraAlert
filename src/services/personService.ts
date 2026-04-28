import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrorHandler";

export interface MissingPerson {
  id?: string;
  name: string;
  age: number;
  gender: string;
  physicalDescription: string;
  photoUrl: string;
  faceDescriptor?: number[];
  lastSeenLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  status: "Active" | "Found" | "Closed";
  reporterId: string;
  reporterContact: string;
  caseNumber: string;
  createdAt: string;
  updatedAt: string;
}

export const registerMissingPerson = async (data: Omit<MissingPerson, "id" | "createdAt" | "updatedAt">) => {
  const path = "missing_persons";
  try {
    const colRef = collection(db, "missing_persons");
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getActiveCases = async () => {
  const path = "missing_persons";
  try {
    const q = query(collection(db, "missing_persons"), where("status", "==", "Active"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MissingPerson));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const subscribeToActiveCases = (callback: (cases: MissingPerson[]) => void) => {
  const path = "missing_persons";
  const q = query(collection(db, "missing_persons"), where("status", "==", "Active"));
  return onSnapshot(q, (snapshot) => {
    const cases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MissingPerson));
    callback(cases);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};
