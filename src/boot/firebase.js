import { firebase } from "@firebase/app";
import "@firebase/firestore";


var firebaseConfig = {
  apiKey: "AIzaSyD0gmGQfKy8A4QKEj-rlyUNkyabzXsCMm0",
  authDomain: "new-gsis-cooperative.firebaseapp.com",
  databaseURL: "https://new-gsis-cooperative.firebaseio.com",
  projectId: "new-gsis-cooperative",
  storageBucket: "new-gsis-cooperative.appspot.com",
  messagingSenderId: "521222059409",
  appId: "1:521222059409:web:454082d24204f860585630",
  measurementId: "G-EDNPCJRJF2"
}

// export const db = firebaseApp.firestore();

//  Initialize Firebase
 let firebaseApp = firebase.initializeApp(firebaseConfig);
 let firebaseAuth = firebaseApp.auth();
 let firebaseDb = firebaseApp.firestore();
 let firebaseSto = firebaseApp.storage();
 let firefirestore = firebase.firestore;


 //2nd app
 let secondaryApp = firebase.initializeApp(firebaseConfig, "secondary");
 let Auth2 = secondaryApp.auth();

 export {Auth2, firebaseAuth, firebaseDb, firebaseSto, firefirestore}