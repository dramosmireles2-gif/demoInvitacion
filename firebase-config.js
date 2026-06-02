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
  apiKey:            "TU-API-KEY-AQUI",
  authDomain:        "TU-PROYECTO.firebaseapp.com",
  projectId:         "TU-PROYECTO",
  storageBucket:     "TU-PROYECTO.appspot.com",
  messagingSenderId: "000000000000",
  appId:             "1:000000000000:web:0000000000000000000000"
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
