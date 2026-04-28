import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use the explicit firestoreDatabaseId as required by the environment
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Validates Firestore connection on boot
 */
async function testConnection() {
  try {
    // Attempt a server-side fetch to verify connectivity
    await getDocFromServer(doc(db, 'system', 'connection_test'));
    console.log("Firestore connected successfully");
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('offline'))) {
      console.error("Firebase connection error: The client is offline. Please check your configuration and network.");
    }
  }
}

testConnection();

export default app;
