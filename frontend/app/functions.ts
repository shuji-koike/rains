import firebase from "firebase/app";

const functions = firebase.app().functions("asia-northeast1");

export const searchReins = functions.httpsCallable("searchReins");
