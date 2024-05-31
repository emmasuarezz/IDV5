import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { Timestamp, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTSI2iEWhTYHDHfE-_sPn6TnQ-U8mJ1dc",
  authDomain: "tenzoid.firebaseapp.com",
  databaseURL: "https://tenzoid-default-rtdb.firebaseio.com",
  projectId: "tenzoid",
  storageBucket: "tenzoid.appspot.com",
  messagingSenderId: "278889108896",
  appId: "1:278889108896:web:0febfbff0ce850c59300c5",
};

export type Post = {
  title: string;
  message: string;
  track: {
    name: string;
    album: string;
    image: string;
    artist: string;
    id: string;
    preview: string;
  };
  uid: string;
  timestamp: Timestamp;
};
export type User = {
  avatar: string;
  displayName: string;
  email: string;
  thumbnail: string;
  username: string;
  uid: string;
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
