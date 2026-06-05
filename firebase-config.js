// ══════════════════════════════════════════════════════════════
//  CONFIGURACIÓN DE FIREBASE
//  ─────────────────────────────────────────────────────────────
//  PASOS PARA CONFIGURAR (5 minutos):
//
//  1. Ve a  https://console.firebase.google.com
//  2. Clic en "Crear un proyecto" → ponle un nombre (ej. boda-andrea-saul)
//     (desactiva Google Analytics si quieres, no es necesario)
//  3. En el panel → "Agregar app" → ícono Web  </>
//  4. Registra la app (nombre cualquiera, ej. "invitacion-digital")
//     Activa "Firebase Hosting" si quieres — no es obligatorio
//  5. Copia el bloque  firebaseConfig  y pégalo abajo
//  6. Ve a  Firestore Database → Crear base de datos → Modo de prueba
//  7. En  Firestore → Reglas  →  pega esto y haz clic en "Publicar":
//
//     rules_version = '2';
//     service cloud.firestore {
//       match /databases/{database}/documents {
//         match /{document=**} {
//           allow read, write: if true;
//         }
//       }
//     }
//
// ══════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyCv57ae_AcqbqmdU0Ut2t1ayPb3yRk1Upc",
  authDomain:        "fir-invitacion.firebaseapp.com",
  projectId:         "fir-invitacion",
  storageBucket:     "fir-invitacion.firebasestorage.app",
  messagingSenderId: "254531361465",
  appId:             "1:254531361465:web:87325ab969a18604179968",
  measurementId:     "G-Q3Y25FPJWF"
};

window._firebaseConfig = firebaseConfig;
window.firebaseConfig = firebaseConfig;

// ── Inicialización ──────────────────────────────────────────
const FIREBASE_OK =
  firebaseConfig.apiKey !== "TU-API-KEY-AQUI" &&
  firebaseConfig.projectId !== "TU-PROYECTO";
window.FIREBASE_OK = FIREBASE_OK;
let db = null;

if (FIREBASE_OK && typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  } catch(e) {
    console.warn('Firebase: error de inicialización.', e.message);
  }
}
