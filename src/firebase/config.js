import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAaEa2NiDIydHjcqZVgMXaNFTtiS2Si2RM",
  authDomain: "tienda-react-visconti.firebaseapp.com",
  projectId: "tienda-react-visconti",
  storageBucket: "tienda-react-visconti.appspot.com",
  messagingSenderId: "674278032128",
  appId: "1:674278032128:web:a06215a1ece59e381d69e5",
  measurementId: "G-K3XVQFEWRV"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar Firestore
export const db = getFirestore(app)



