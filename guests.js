// ══════════════════════════════════════════════════════════════
//  LISTA DE INVITADOS
//  ─────────────────────────────────────────────────────────────
//  Formato de cada entrada:
//    'clave': { name: 'Nombre completo', passes: N, table: N }
//
//  La CLAVE es el identificador que va en la URL del QR:
//    https://dramosmireles2-gif.github.io/demoinvitacion/?g=CLAVE
//
//  Reglas para la clave:
//    - Solo letras minúsculas y números (sin espacios ni acentos)
//    - Ej.: 'rodriguez', 'garza', 'pena', 'soto2'
//
//  Contraseña del panel admin (cámbiala antes de publicar):
// ══════════════════════════════════════════════════════════════

const ADMIN_PASSWORD = 'demo2027';

const WEDDING_GUESTS = {
  // ── Invitado para el QR de demostración ────────────────────
  'demo':       { name: 'Familia Demo',           passes: 4, table: 1  },
  // ── Invitados de ejemplo ────────────────────────────────────
  'rodriguez':  { name: 'Familia Rodríguez',    passes: 2, table: 5  },
  'herrera':    { name: 'Dr. Martín Herrera',    passes: 4, table: 2  },
  'soto':       { name: 'Valentina Soto',         passes: 1, table: 8  },
  'garza':      { name: 'Familia Garza Leal',     passes: 6, table: 1  },
  'cisneros':   { name: 'Roberto Cisneros',       passes: 2, table: 11 },
  'pena':       { name: 'Ing. Carlos Peña',       passes: 2, table: 7  },
  'torres':     { name: 'Familia Torres',          passes: 4, table: 3  },
  'fuentes':    { name: 'Lic. María Fuentes',     passes: 2, table: 9  },
  // ── Agrega más invitados aquí ──────────────────────────────
  // 'lopez':   { name: 'Familia López',          passes: 4, table: 6  },
  // 'santos':  { name: 'Familia Santos',          passes: 2, table: 10 },
  // 'reyes':   { name: 'Lic. Jorge Reyes',        passes: 2, table: 4  },
};
