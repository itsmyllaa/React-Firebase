import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAhGuOtac-w3lRphHh-4Q9e1uu2hMiMafM",
    authDomain: "https-camila-br.firebaseapp.com",
    projectId: "https-camila-br",
    storageBucket: "https-camila-br.appspot.com",
    messagingSenderId: "730259398773",
    appId: "1:730259398773:web:0ea806fbb66337625d183c",
    measurementId: "G-E42D8KEZ4C"
  };
  
  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp)

  export { db, auth };