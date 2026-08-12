import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (token) => {
  try {
    const decoded = await admin.auth().verifyIdToken(token);

    return decoded;
  } catch (error) {
    throw new Error("Invalid Firebase Token");
  }
};
