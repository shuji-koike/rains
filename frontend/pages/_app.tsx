import * as React from "react";
import "./index.css";

import firebase from "firebase/app";
import "firebase/functions";

if (!firebase.apps.length)
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    appId: process.env.FIREBASE_APP_ID,
  });

interface AppProps {
  Component: React.FC;
  pageProps: {};
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
