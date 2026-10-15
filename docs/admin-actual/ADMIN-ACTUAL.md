# Sistema actual de invitaciones — documentación previa a la migración (Vite + Supabase)

> Alcance de este documento: **solo** la invitación demo (`index.html` en la raíz, Iván & Gemima, fecha ficticia 18 oct 2027) y el panel admin que le corresponde (`plantillas/admin.html`), más los archivos compartidos que ambos cargan. **No cubre** `ivan-gemima/`, `eunice-edher/` (clientes reales en vivo), las 12 plantillas de `plantillas/`, `_archivo/` ni `_marketing/`. Cuando esos sistemas aparecen mencionados es solo porque algo del código en alcance apunta hacia ellos.
>
> Todas las afirmaciones citan archivo y línea para poder verificarlas. Ninguna contraseña, API key o dato de invitado real se copió en este documento — solo se indica dónde viven.

---

## 1. Alcance y archivos

### 1.1 Archivos que componen la demo

| Archivo | Líneas | Peso | Rol |
|---|---|---|---|
| `index.html` (raíz) | 1867 | 93 KB | Invitación del invitado — "Iván & Gemima", boda ficticia 18 oct 2027 |
| `plantillas/admin.html` | 4253 | 171 KB | Panel de administración que corresponde a esa invitación (ver §1.3 por qué es este y no otro) |
| `firebase-config.js` (raíz) | 54 | 2.5 KB | Config + inicialización de Firebase, compartido por ambos |

Ambos son HTML autocontenidos: todo el CSS y JS vive en `<style>`/`<script>` inline dentro del propio archivo, sin build ni bundler. Se sirven como sitio estático (hay un `CNAME` en la raíz apuntando a `inv.ramosmkt.lat`, patrón típico de GitHub Pages).

### 1.2 Dependencias externas (CDN)

| Dependencia | Usado por | Línea |
|---|---|---|
| Firebase 10.12.0 — `firebase-app-compat.js` | `index.html`, `admin.html` | `index.html:1335`, `admin.html:2038` |
| Firebase 10.12.0 — `firebase-firestore-compat.js` | `index.html`, `admin.html` | `index.html:1336`, `admin.html:2039` |
| Google Fonts — Cormorant Garamond, Cormorant SC, Great Vibes, Jost | `index.html` | `index.html:23` |
| Google Fonts — DM Sans | `admin.html` | `admin.html:9` |
| `unpkg.com/feather-icons` | `admin.html` (iconos del sidebar) | `admin.html:10` |
| `api.qrserver.com` | `admin.html`, bajo demanda al abrir "Ver QR" | `admin.html:3971` (ver riesgo en §7) |
| `open.spotify.com/embed/...` (iframe) | `index.html`, sección música | `index.html:1575-1577` |
| `maps.google.com` / `google.com/maps` (iframes embed) | `index.html`, tarjetas de ubicación | `index.html:1123,1139` |

Ninguno de los dos archivos en alcance carga `guests.js`, `sections-new-shared.css/js` ni `gratitude-note-shared.css` — se confirmó con `grep` que esos archivos compartidos solo los usan las 12 plantillas de `plantillas/`, `eunice-edher/` e `ivan-gemima/` (todos fuera de alcance). No forman parte de la demo.

### 1.3 Por qué `plantillas/admin.html` es el admin de esta demo

`index.html` solo lee una colección/documento de Firestore: `demo_config/event` (`index.html:1595`). `plantillas/admin.html` es el único panel que escribe exactamente en ese mismo documento — la constante `DEMO_CONFIG_DOC = 'demo_config'` (`admin.html:4094`) y las llamadas `db.collection(DEMO_CONFIG_DOC).doc('event').set(cfg)` en `saveEventConfig()`/`saveGiftsConfig()` (`admin.html:4106`). Ambos archivos además comparten el mismo `firebaseConfig` (mismo proyecto `fir-invitacion`) vía `../firebase-config.js` / `./firebase-config.js`. Es también el panel que aparece enlazado en los flyers (`flyer.html`, `flyer-ig.html`, `flyer-promo.html` en la raíz).

### 1.4 Dependencias cruzadas con carpetas fuera de alcance (hallazgo importante)

La demo **no es autocontenida**: varios recursos que usa `index.html` viven físicamente dentro de `ivan-gemima/` (la carpeta del cliente real, fuera de alcance):

| Recurso | Ruta usada por `index.html` | Línea |
|---|---|---|
| Música de fondo (13 MB) | `./ivan-gemima/La Bondad De Dios.mp3` | `index.html:1023,1357` |
| Galería (7 fotos) | `./ivan-gemima/foto1.jpeg` … `foto7.jpeg` | `index.html:1359` |
| Foto de "Nuestra historia" | `./ivan-gemima/Principal.jpeg` | `index.html:1161` |
| Imagen de Open Graph / Twitter Card | `https://inv.ramosmkt.lat/ivan-gemima/Principal.jpeg` | `index.html:14,20` |

Además, `favicon.png` referenciado en `index.html:7` **no existe en la raíz del repo** (solo existe dentro de `ivan-gemima/favicon.png`) — es un enlace roto (ver §7).

Otros recursos sí viven en `plantillas/` (carpeta compartida con las 12 plantillas, pero los archivos puntuales que usa la demo están en alcance como asset): `plantillas/Iglesia.png` (666 KB) y `plantillas/Salon.png` (1.7 MB, sin uso real — ver §7) referenciados en `index.html:1113,1355,1356`. `Hacienda-La-concepcion.jpg` (69 KB) vive en la raíz y se usa en `index.html:1129`.

---

## 2. Invitación demo — sección por sección (orden de aparición)

| # | Sección | Elemento | Interacción | Origen de los datos |
|---|---|---|---|---|
| 0 | Portada / sobre | `#envelope-screen` (`index.html:1035-1057`) | Tap en la tarjeta → `openEnvelope()` (`1400-1423`): anima, lanza pétalos, muestra la invitación | Texto fijo en HTML |
| 1 | Hero | `.inv-hero` (`1062-1073`) | Flecha de scroll decorativa | Texto fijo en HTML |
| 2 | Contador regresivo | `.inv-countdown-wrap` (`1075-1084`) | Se actualiza cada segundo (`startCountdown()`, `1748-1759`) | `WEDDING_CONFIG.weddingDate` (`1340`) — el único dato de fecha que sí es "config" real |
| 3 | Fecha + mini calendario | `.inv-date-block` (`1088-1095`) | — | Texto fijo + `buildMiniCalendar()` (`1455-1472`) con año/mes **hardcoded** (`year=2027, month=9`, línea 1457) |
| 4 | Horario | `.inv-timeline` (`1097-1102`) | — | `buildTimeline()` (`1477-1489`) lee `WEDDING_CONFIG.schedule` (array fijo de 3 eventos, `1342-1346`) |
| 5 | Ubicaciones | `.inv-locations` (`1106-1141`) | Botón "Cómo llegar" (link externo a Maps), iframe embebido de Google Maps | **Texto e imágenes fijos en el HTML** (`1110-1140`), no se generan desde `WEDDING_CONFIG.church` (ese objeto existe en `1348-1353` pero `buildChurchMap()`/`buildVenueImage()` están vacíos, `1494-1495` — dos fuentes de verdad para el mismo dato) |
| 6 | Galería | `#gallery-section` (`1143-1152`) | Clic abre lightbox con swipe táctil y flechas de teclado (`1516-1551`) | `buildGallery()` (`1503-1514`) lee `WEDDING_CONFIG.gallery` (7 fotos de `ivan-gemima/`) |
| 7 | Nuestra historia | `.nuestra-historia` (`1156-1164`) | — | Texto + foto fijos en HTML |
| 8 | Invitado + RSVP | `#rsvp-section` (`1168-1194`) | Botones Asistiré/No asistiré + mensaje opcional + Confirmar (ver §3 — no guarda nada) | Nombre/pases/mesa: objeto `guest` **hardcoded** (`1383`), siempre el mismo sin importar el link |
| 9 | Mesa de regalos | `.inv-gifts` (`1196-1225`) | Botón "Copiar" CLABE; tarjetas Amazon/Liverpool solo si hay URL configurada | `WEDDING_CONFIG.gifts` (`1361-1369`), con overrides aplicados desde Firestore `demo_config/event` (`1587-1598`, único flujo que de verdad sincroniza con el admin) |
| 10 | Música / playlist colaborativa | `#section-music` (`1227-1237`, oculta por defecto) | Iframe embed de Spotify + botón "Abrir en Spotify" | Se muestra solo si `gifts.spotifyPlaylistUrl` tiene valor (`buildGifts()`, `1571-1583`) |
| 11 | Código de vestimenta | `.inv-dresscode` (`1239-1278`) | — | Texto y colores de swatches **fijos en HTML**, no editables desde el admin |
| 12 | Lista de deseos | `#section-wishlist` (`1280-1285`, oculta) | Solo visible con `?tipo=cumple` en la URL | `WEDDING_CONFIG.wishlist` (array de ejemplo ficticio, `1371-1374`) |
| 13 | Gender reveal | `#section-gender` (`1287-1307`, oculta) | Solo visible con `?tipo=genero`; votar dispara confetti | Voto guardado únicamente en `localStorage` (`gender_voted`, `1640-1668`) — sin Firestore |
| 14 | CTA de calendario | `.inv-calendar-cta` (`1309-1321`) | Botones Google/Apple/Outlook generan evento (`.ics` al vuelo, `1698-1719`) | Fechas correctas en la lógica (`20271018`), pero el **texto visible dice "Sábado 2 de Octubre · 2027"** (`1314`) — inconsistente (ver §7) |
| 15 | Footer | `.inv-footer` (`1323-1331`) | — | Texto fijo + crédito "RMKT Web & Apps" |

Interacciones transversales (no atadas a una sola sección): música de fondo con autoplay tras abrir el sobre (`1416-1419`), botón flotante de música (`#music-btn`, `1025`), partículas de fondo decorativas (`#aurora-canvas`, `1810-1844`), barra de progreso de lectura (`#read-progress`, `1856-1864`), animaciones de aparición al hacer scroll (`initScrollReveal()`, `1849-1854`).

---

## 3. Flujo del invitado de punta a punta

**Abre el link con `?g=clave`:** `index.html` **nunca lee ese parámetro**. Se confirmó revisando todo el archivo: el único uso de `URLSearchParams` es para leer `tipo` (`index.html:1380`, usado solo para mostrar/ocultar wishlist o gender-reveal). El objeto `guest` que alimenta la tarjeta "Esta invitación es para" está hardcodeado (`index.html:1383`: `{ name: 'Estimado Invitado', passes: 2, table: '—' }`) y se aplica una sola vez al cargar la página (`applyGuest(guest)`, línea 1390), siempre con los mismos datos.

**Conclusión:** con una clave válida, una clave inexistente o sin clave en absoluto, la experiencia es **exactamente la misma** — invitación genérica para "Estimado Invitado · 2 pases". Los enlaces personalizados que genera el admin (`?g=clave`) no tienen ningún efecto sobre este archivo (y de hecho apuntan a otra carpeta — ver §4 y §7).

**Abre el sobre:** tap en la tarjeta → `openEnvelope()` (`index.html:1400-1423`): anima la tarjeta, lanza pétalos, 700 ms después oculta `#envelope-screen` y muestra `#invitation`, arranca el contador, llama a `trackVisit()` y `checkExistingRSVP()` — **ambas funciones están vacías** (`index.html:1392-1393`), reproduce la música y activa el scroll-reveal.

**Confirma o declina:** `selectRSVP('yes'|'no')` (`1764-1768`) solo cambia el estilo visual del botón elegido. `submitRSVP()` (`1770-1792`): si no se eligió nada, muestra un aviso de validación; si se eligió, deshabilita el botón, cambia el texto a "¡Gracias!" y anima la transición a la vista de éxito. El propio código lo documenta: el bloque se titula `/* RSVP (demo — sin guardado) */` (`1761-1763`).

**Qué se guarda, en qué colección y con qué campos:** **nada**. No hay ninguna llamada a Firestore, `fetch` ni `localStorage` dentro de `selectRSVP`/`submitRSVP`. Si se recarga la página, el formulario vuelve a su estado inicial y no queda ningún rastro de que ese invitado respondió.

**Clave que no existe o ausencia de clave:** mismo comportamiento que cualquier otro caso — no hay validación de clave porque no se lee ninguna.

---

## 4. Panel admin — pantalla por pantalla

### Acceso

Overlay `#auth-overlay` (`admin.html:1538-1563`). La contraseña se compara como **literal de texto en `checkAuth()`** (`admin.html:2113`) — no se reproduce aquí, pero vive ahí, sin hash ni backend, visible para cualquiera que abra "Ver código fuente" del panel. Al acertar, se guarda `sessionStorage.setItem('admin_auth','1')` (`2114`), válido solo para esa pestaña/sesión del navegador — se vuelve a pedir en una pestaña nueva.

### Navegación

Sidebar fijo en escritorio con 8 ítems (`admin.html:1569-1606`) + barra inferior en móvil con 5 accesos directos + "Más" (`2009-2032`). `navTo()` (`2149-2171`) cambia la pestaña activa y mueve un indicador animado (`placeNavIndicator()`, `2175-2200`); el título superior se toma de `PANEL_TITLES` (`2138-2148`).

### Pantallas

**1. Resumen general** — `#panel-resumen` (`1641-1736`)
Banner de bienvenida (texto fijo que dice "todo en tiempo real... sin necesidad de hacer nada", `1649` — ver §7), 4 tarjetas de estadística con animación de conteo (Total de pases / Ya confirmaron / Sin responder / No asistirán), barra de progreso, countdown del evento (con el lugar **hardcodeado** "Finca Santa Lucía · Córdoba, Veracruz", `1709` — inconsistente, ver §7) y leyenda de estados. Todo se calcula con `renderDashboard(LOCAL_RSVP)`, una constante de datos de ejemplo definida en el propio archivo (`2063-2079`), no datos reales de Firestore.

**2. Lista de invitados** — `#section-guests` (`1739-1804`)
Tabla (Invitado / Pases / Mesa / Grupo / Estado / Mensaje / Confirmó el / acciones), filtros (Todos, Sin confirmar, No abrieron, Confirmados, No asistirán), botón "Exportar CSV" (`exportCSV()`, `4043-4072`), botón "+ Agregar" (abre modal), editar/eliminar por fila, selector de mesa y de grupo embebidos en cada renglón. Panel de fecha límite de confirmación. Datos: `WEDDING_GUESTS` (constante hardcodeada + lo que se agregue a mano, persistido en `localStorage`) combinado con `LOCAL_RSVP` (igual, hardcodeado).

**3. Mesas** — `#section-tables` (`1807-1871`)
Encabezado con estadísticas rápidas y botones "Grupos" / "Generar varias" / "+ Agregar mesa"; panel "Salud del acomodo" (avisos de sobrecupo, mesas casi vacías, resumen de confirmados/por confirmar, `renderHealth()`, `2940-3036`); plano visual arrastrable (mesas redondas/rectangulares/imperiales, hasta 15 asientos salvo imperial que permite 30 — `MAX_TABLE_CAPACITY`, `admin.html:3534`); tocar un asiento o arrastrar un invitado lo sienta (Pointer Events, `startGuestDrag()`/`dropGuestOnTable()`, `3434-3536`); botones "Modo recepción" (buscador de mesa por nombre, pantalla completa), "Ajustar vista", "Lista por mesa" e "Plano" (ambos abren una vista de impresión, `printSeatingList()`/`printFloorPlan()`, `3049-3122`); bandeja de "Invitados sin mesa". Tocar una mesa abre su tarjeta de edición; tocar un invitado abre la "tarjeta de familia" (`openFamilyCard()`, `3181-3214`) para repartir sus pases entre varias mesas.

**4. Actividad en tiempo real** — `#section-activity` (`1874-1890`)
Lista de aperturas/confirmaciones ordenada por fecha (`renderActivity()`, `3871-3904`), botón "Limpiar" (`clearAllActivity()`, `3713-3724`) — **este sí llama a Firestore de verdad**: borra todos los documentos de `demo_rsvps`. Datos de la lista: `LOCAL_RSVP` hardcodeada.

**5. Enlaces personalizados** — `#section-urls` (`1893-1907`)
Una fila por invitado con su "enlace único" `?g=clave`, botón "Copiar enlace", "Ver QR" (genera imágenes vía `api.qrserver.com`, enviando nombre y clave a ese servicio externo — `openQRModal()`, `3951-3983`) y "Copiar todos" (`copyAllUrls()`, `3941-3948`). **Los enlaces apuntan a `ivan-gemima/?g=clave`** (`renderUrlsList()`, `admin.html:3925`), **no** a la invitación demo de este mismo repositorio — ver §7.

**6. Mensajes** — `#section-messages` (`1910-1925`)
Lista de mensajes dejados al "confirmar" (`renderMessages()`, `3992-4042`) — datos de `LOCAL_RSVP` hardcodeada.

**7. Mesa de regalos** — `#panel-gifts` (`1928-1955`)
Formulario (Banco / CLABE / Alias / Amazon / Liverpool / Spotify, `GIFT_FIELDS`, `4173-4180`) + vista previa de tarjetas (`renderGiftsPreview()`, `4204-4221`) + botón "Guardar cambios" → `saveGiftsConfig()` (`4223-4227`) → escribe en `localStorage` **y** en Firestore `demo_config/event` (`persistConfigFields()`, `4096-4109`). Es el **único** flujo de configuración que de verdad llega hasta `index.html` (confirmado en `index.html:1587-1598`).

**8. Editar evento** — `#section-event` (`1958-1974`)
Formulario (Fecha del evento / Nombre de la iglesia / Link Maps iglesia / Nombre del salón / Link Maps salón / Fecha límite RSVP, `buildEventForm()`, `4111-4136`) + botón "Guardar cambios" → `saveEventConfig()` (`4145-4153`) → **también** escribe en Firestore `demo_config/event`. El texto de la pantalla dice "Los cambios se aplican en la invitación al recargar" / "se sincronizan con la invitación en tiempo real" (`1962,1971`) — **pero `index.html` nunca lee esos 6 campos de vuelta**, solo los de regalos (ver §7, es el hallazgo más importante de esta revisión).

Modal adicional: Agregar/editar invitado (`#guest-modal-overlay`, `1979-2007`).

### Qué se actualiza "en tiempo real"

En sentido estricto, nada se sincroniza entre pestañas/dispositivos en vivo (no hay `onSnapshot`, solo `.get()` puntuales al cargar la página). Lo único que persiste en Firestore y se vuelve a leer al recargar es: `demo_config/event` (solo los 6 campos de regalos los usa `index.html`) y `demo_config/groups`. Todo lo demás —lista de invitados, mesas, asientos, grupos asignados— vive únicamente en el `localStorage` del navegador donde se editó (ver detalle completo en §5 y el bug correspondiente en §7).

---

## 5. Modelo de datos

### 5.1 Firestore (proyecto `fir-invitacion`, ver `firebase-config.js:27-35`)

| Colección / doc | Campos (tipo) | Ejemplo ficticio | Quién escribe | Quién lee |
|---|---|---|---|---|
| `demo_config/event` | `weddingDate` (string datetime-local), `churchName` (string), `churchMaps` (string URL), `venueName` (string), `venueMaps` (string URL), `rsvpDeadline` (string date), `bankName` (string), `bankClabe` (string), `bankAlias` (string), `amazonUrl` (string URL), `liverpoolUrl` (string URL), `spotifyPlaylistUrl` (string URL) — todos opcionales, se omiten si están vacíos | `{ bankName: "BBVA", bankClabe: "012345678901234567", spotifyPlaylistUrl: "https://open.spotify.com/playlist/abc123" }` | `admin.html` (`saveEventConfig` y `saveGiftsConfig`, mismo doc) | `admin.html` al iniciar (`3697`) e `index.html` (`1595`, **solo** toma los 6 campos de regalos, ignora el resto) |
| `demo_config/groups` | `list`: array de `{ id (string), name (string), color (string hex) }` | `{ list: [{id:"novia", name:"Familia novia", color:"#c17aa0"}] }` | `admin.html` (`saveGroups`, `2412-2414`) | `admin.html` al iniciar (`3684`) |
| `demo_guests/{clave}` | `name` (string), `passes` (number), `table` (string), `group?` (string id), `seating?` (array `{table,passes}`), `enviado?` (bool) | `{ name: "Familia Pérez", passes: 3, table: "2" }` | `admin.html`, en 6 puntos distintos: alta/edición (`2345`), grupo (`2433`), mesa (`2693`), reparto entre mesas (`2735`), enviado (`2360-2361`), baja (`2378`) | **Nadie.** Ni `admin.html` ni `index.html` hacen `.get()` sobre esta colección — es de solo escritura (ver §7) |
| `demo_rsvps/{clave}` | (no se encontró ningún `.set()`/`.update()` en los archivos en alcance — estructura inferida solo por el borrado) | — | Nadie, dentro del alcance revisado | `admin.html` la borra por completo (`clearAllActivity()`, `3716`) y borra el doc individual al eliminar un invitado (`deleteGuest()`, `2379`), "por si acaso" |

### 5.2 Solo en el navegador (no Firestore)

| Nombre en código | `localStorage` key | Contenido | Respaldo en Firestore |
|---|---|---|---|
| `WEDDING_GUESTS` (objeto en código, `admin.html:2043-2059`) | `wedding_guests_extra` | Invitados nuevos/editados a mano | Se intenta escribir en `demo_guests` pero nunca se lee de vuelta (huérfano) |
| `LOCAL_RSVP` (objeto en código, `admin.html:2063-2079`) | — | 100% datos de ejemplo inventados, no proviene de ningún guardado real | Ninguno |
| `WEDDING_GROUPS` (`admin.html:2396`) | `wedding_groups` | Grupos de invitados y su color | Sí — `demo_config/groups` |
| `tablesConfig` (`admin.html:2517`) | `wedding_tables_config` | `{ "1": { label, capacity, shape?, note?, x, y }, ... }` — plano de mesas | **Ninguno** — no sincroniza entre dispositivos (ver §7) |
| Config de evento/regalos (caché local) | `aurora_event_override` | Copia local de `demo_config/event`, usada antes de que responda Firestore | Sí — es la misma fuente |
| Voto de gender reveal | `gender_voted` | `'boy'` o `'girl'`, por dispositivo | Ninguno |

---

## 6. Configuración por boda — todos los lugares a cambiar a mano

| Dato | Archivo : líneas | Notas |
|---|---|---|
| Nombres de los novios | `index.html:6,12,18,1041,1044,1046,1066,1161,1326,1691,1702,1706` · `admin.html:6,1542,1572,1623,3090,3110` | 11 lugares en `index.html` + 7 en `admin.html` — sin una sola fuente de verdad |
| Fecha de la boda | `index.html:6,13,19,1049,1065,1178,1314(⚠️ desactualizada),1327,1340,1457,1467,1691-1692,1702,1704-1705` · `admin.html:1562,1574` | Solo la línea `1340` (`WEDDING_CONFIG.weddingDate`) alimenta el contador regresivo; el resto es texto suelto. El mini-calendario (`1457,1467`) tiene su propio año/mes hardcodeado aparte |
| Fecha límite de RSVP | `index.html:1178` (texto fijo "Antes del 15 de Septiembre · 2027") | El campo "Fecha límite RSVP" del admin (`rsvpDeadline`) se guarda pero **no** llega a este texto (bug, ver §7) |
| Iglesia / ceremonia (nombre, dirección, mapa) | `index.html:1110-1124` (HTML fijo, lo que realmente se ve) + `WEDDING_CONFIG.church`, `1348-1353` (objeto sin uso real) | El formulario "Editar evento" (`churchName`/`churchMaps`) no actualiza ninguno de los dos |
| Salón / recepción (nombre, dirección, mapa) | `index.html:1126-1140` (HTML fijo) | Mismo problema que iglesia; además `admin.html:1709` muestra un lugar **distinto y desactualizado** ("Finca Santa Lucía · Córdoba, Veracruz") |
| Fotos (iglesia, salón, historia, galería) | `WEDDING_CONFIG.churchImage/venueImage/gallery`, `index.html:1355-1359` + `<img>` fijos en `1113,1129,1161` | `venueImage` no se usa en ningún lado (`buildVenueImage()` vacío, `1495`) |
| Música de fondo | `index.html:1023` (`<source>` real) y `1357` (`WEDDING_CONFIG.music`, no conectado al `<audio>`) | Dos lugares para el mismo dato, uno de ellos sin efecto |
| Colores / paleta | `index.html` `:root` (≈ línea 44-58) · `admin.html` `:root` (`14-31`) | Bien centralizado — un solo lugar por archivo |
| Lista de invitados | `admin.html:2043-2059` (`WEDDING_GUESTS`) | Objeto hardcodeado completo a reemplazar por cliente |
| Contraseña del panel | `admin.html:2113` (`checkAuth()`) | Literal en el código fuente, sin indirección ni hash |
| Colección/documento de Firestore | `admin.html:4094` (`DEMO_CONFIG_DOC='demo_config'`) + literales repetidos `'demo_guests'`/`'demo_rsvps'` en 9 lugares distintos | No hay una sola constante para todos los nombres de colección |
| Mesa de regalos (banco, Amazon, Liverpool, Spotify) | `admin.html:4173-4180` (`GIFT_FIELDS`, editable desde el formulario) | **El único bloque de configuración que funciona como se espera de punta a punta** |
| Código de vestimenta (texto y colores) | `index.html:1239-1278` | Totalmente fijo, sin ningún campo en el admin |
| Meta tags / título / Open Graph / favicon | `index.html:6-20` | URLs absolutas a `inv.ramosmkt.lat` y a `ivan-gemima/` ya quemadas; `favicon.png` roto (ver §7) |

---

## 7. Problemas encontrados

### Seguridad

- **Contraseña del admin en texto plano** dentro del JavaScript que se sirve al navegador (`admin.html:2113`) — cualquiera puede leerla con "Ver código fuente". No hay backend que la valide; `sessionStorage` solo controla si se vuelve a pedir, no protege nada.
- **API key de Firebase embebida** en `firebase-config.js:28` — es el patrón normal en apps web de Firebase, pero **solo es seguro si las reglas de Firestore restringen lectura/escritura**. No se pudieron revisar esas reglas desde este repositorio (viven en la consola de Firebase) — **pregunta abierta, §9**. El propio `firebase-config.js:16-23` sugiere como ejemplo de configuración inicial la regla `allow read, write: if true`, que si sigue activa en producción permitiría a cualquiera con la API key (visible en el HTML) leer o borrar cualquier documento del proyecto.
- Nombres y claves de invitados se envían por GET a `api.qrserver.com` (`admin.html:3971`) para generar cada QR — con datos ficticios no hay impacto, pero con invitados reales expone nombre + clave a un tercero.
- No hay control de acceso por rol dentro del panel — una sola contraseña compartida da acceso a borrar invitados, actividad y exportar CSV con datos personales.

### Bugs — commits recientes revisados

| Commit | Qué arregló | ¿Bien resuelto? |
|---|---|---|
| `7d764ae` — NaN en "Confirmó el" | El parseo de fecha solo soportaba `.toDate()`, no `.toMillis()` (formato real de los datos de ejemplo) | ✅ Sí — verificado con capturas (§10) y con pruebas automatizadas que ya dejó el propio repo |
| `ee11920`/`1022f97` — contador fuera de pantalla | Columnas de grid `1fr` no encogían por debajo del contenido ("SEGUNDOS"), sacaba la última caja de la pantalla en iPhone 14 Pro Max | ✅ Sí — verificado en rango 320-480px |
| `817f62c` (PR #125) — "re-render dashboard cuando cargan invitados de Firestore" | Condición de carrera entre el listener de RSVPs y la carga de invitados | ⚠️ **Ese commit solo toca `eunice-edher/admin/index.html`, fuera de alcance de este documento.** `plantillas/admin.html` no puede tener ese bug: no usa listeners de Firestore para invitados/RSVPs — usa las constantes hardcodeadas `WEDDING_GUESTS`/`LOCAL_RSVP` (§5), así que no hay carga asíncrona con la que competir |

### Bugs nuevos encontrados en esta revisión (no reportados antes)

1. **El formulario "Editar evento" no tiene efecto real.** Dice "se aplican en la invitación al recargar" / "se sincronizan... en tiempo real" (`admin.html:1962,1971`), pero `index.html` solo aplica los 6 campos de **regalos** desde Firestore (`index.html:1587-1591`); `weddingDate`, `churchName`, `churchMaps`, `venueName`, `venueMaps` y `rsvpDeadline` se guardan pero nunca se leen de vuelta. Es el hallazgo más importante de esta revisión porque contradice directamente lo que el panel le promete al organizador.
2. **`demo_guests` es una colección de solo escritura.** Se escribe desde 6 puntos distintos del admin pero ni `admin.html` ni `index.html` la leen nunca. El comentario del propio código ("persist in Firestore so invitation works on any device", `admin.html:2343`) es incorrecto.
3. **El plano de mesas (`tablesConfig`) no sincroniza entre dispositivos** — vive únicamente en `localStorage`, sin ningún respaldo en Firestore.
4. **Los "Enlaces personalizados" y los QR apuntan a `ivan-gemima/?g=clave`**, no a la propia invitación demo (`admin.html:3925,3945,3970`).
5. **`toggleEnviado()` tiene un bug latente**: llama a `renderGuests(rsvpData)` (`admin.html:2364`), pero ni esa función ni esa variable existen (la función real se llama `renderGuestTable`, la variable `lastRsvpData`). No está conectada a ningún botón visible — código muerto con un error esperando a ser activado.
6. **`favicon.png` no existe en la raíz** (`index.html:7`) — 404 silencioso.
7. **Copy desactualizado — CTA de calendario**: el texto dice "Sábado 2 de Octubre · 2027" (`index.html:1314`) pero la boda real es el 18 de octubre (confirmado en 9+ lugares); los botones de Google/Apple/Outlook sí usan la fecha correcta internamente.
8. **Copy desactualizado — dashboard del admin**: muestra "Finca Santa Lucía · Córdoba, Veracruz" (`admin.html:1709`) en vez de "Hacienda La Concepción, San Nicolás de los Garza, N.L." — resto de un cliente o demo anterior.

### UX confusa

- El banner de bienvenida del admin afirma que todo se actualiza "en tiempo real... sin necesidad de hacer nada" (`admin.html:1649`), pero Lista de invitados, Mensajes, Actividad y Estados son 100% datos de ejemplo fijos — puede hacerle creer al cliente que ya está viendo información real.
- Las columnas "Confirmó el" y los filtros "Confirmados"/"No asistirán" sugieren un flujo de RSVP funcionando, pero la invitación demo nunca guarda ninguna respuesta (§3) — es puramente ilustrativo.
- Nada en el panel explica que el campo "Spotify" del formulario de Regalos también decide si se muestra toda la sección de música en la invitación — relación no obvia entre un campo y una sección completa.

### Rendimiento

- Música de fondo de 13 MB (`ivan-gemima/La Bondad De Dios.mp3`) — tiene `preload="none"` (correcto, no se descarga hasta dar play) pero sigue siendo pesada para datos móviles.
- `plantillas/Salon.png` pesa 1.7 MB y **no se usa en ningún lado** (`buildVenueImage()` vacío) — peso muerto en el repo, aunque no se descarga en el navegador al no estar referenciado en el DOM.
- `plantillas/Iglesia.png` (666 KB) sí se usa — formato PNG para una fotografía es ineficiente, convendría JPEG/WebP.
- Canvas de partículas decorativo + 5 "orbs" con animación CSS infinita (`index.html:1810-1844`) sin opción de desactivar — hay un chequeo de `prefers-reduced-motion` pero solo para la animación de conteo del admin (`admin.html:4160`), no para las partículas de la invitación.
- Los 3 scripts de Firebase se cargan al final del `<body>` en ambos archivos (no bloquean el primer render) — correcto.
- Los iframes de Google Maps usan `loading="lazy"` — correcto.

### Accesibilidad

- `<html lang="es">` presente en ambos archivos (`index.html:2`, `admin.html:2`).
- Los botones de música/lightbox tienen `aria-label` (`index.html:1025,1028,1029,1031`) — bien.
- Las fotos de galería usan `alt` genérico ("Foto 1", "Foto 2"…, `index.html:1510`) — no describen contenido real, bajo valor para lectores de pantalla.
- Los botones "Asistiré"/"No asistiré" no usan `aria-pressed` para anunciar cuál está seleccionado a un lector de pantalla (`index.html:1181-1182`) — funcionan bien con mouse/touch mediante clases CSS, pero no se comunica el estado por accesibilidad.
- Las correcciones de foco visible y asociación `label`/`for` en los formularios de Regalos/Evento del admin (PR #103) siguen vigentes.
- No se pudo medir contraste de color real (texto dorado sobre fondo oscuro) en este entorno — pendiente, ver §9.

### Código duplicado

- La fecha de la boda y los nombres de los novios están hardcodeados en más de 15 lugares combinados entre los dos archivos (detalle completo en §6) — alto riesgo de que alguno quede desactualizado, como de hecho ya ocurrió (hallazgos 7 y 8 arriba).
- La dirección de la iglesia/salón existe simultáneamente como objeto JS (`WEDDING_CONFIG.church`) y como HTML fijo — dos fuentes de verdad, y la que realmente se ve es la fija (la función que debería usar el objeto, `buildChurchMap()`, está vacía).
- Los nombres de colección de Firestore (`'demo_guests'`, `'demo_rsvps'`) están repetidos como literales en 9 lugares en vez de una sola constante (solo `'demo_config'` tiene su propia constante `DEMO_CONFIG_DOC`).

---

## 8. Lo que funciona bien y vale la pena conservar

- **Navegación por tabs real** en el admin (sidebar + barra inferior sincronizados, indicador animado, título dinámico) — base sólida para replicar.
- **El plano visual de mesas** (arrastrar, redimensionar, asientos tocables, tarjeta de familia para repartir pases entre varias mesas, grupos con color, panel de "salud del acomodo") es la pieza de UX más completa y mejor pensada de todo el sistema.
- **El flujo de "Mesa de regalos"** (formulario → vista previa en vivo → guardado en Firestore → aplicado en la invitación) es el único circuito de configuración que de verdad funciona de punta a punta — buena plantilla de cómo debería comportarse **todo** el panel en el sistema nuevo.
- **Paleta de color centralizada** en variables CSS `:root` en ambos archivos — fácil de re-temizar por cliente.
- **Correcciones ya aprendidas** de compatibilidad iOS (`position:fixed` con `overflow-x:hidden`), de CSS Grid (`minmax(0,1fr)` para evitar overflow con texto largo) y de accesibilidad (foco visible, `label`/`for`) — vale la pena preservar esas reglas, no solo repetir el resultado visual.
- **Exportar CSV, imprimir lista por mesa/plano, códigos QR** — funciones de "última milla" útiles el día del evento.
- El **countdown con `clamp()` responsivo** (ya corregido) es un buen patrón a seguir para evitar overflow en otros componentes con texto largo o de ancho variable.

---

## 9. Preguntas abiertas

1. ¿El sistema nuevo debe guardar RSVP real por invitado (clave única en la URL, con persistencia) desde el día uno, o se mantiene como función pendiente en una primera versión?
2. ¿Cada boda tendrá su propio proyecto/base de datos (o esquema separado en Supabase), o se seguirá compartiendo un mismo proyecto con "colecciones"/tablas por cliente? Esto cambia por completo el modelo de seguridad.
3. ¿El panel nuevo debe tener usuarios/roles reales (login con Supabase Auth), en vez de una sola contraseña compartida y visible en el código?
4. ¿Cuáles son las reglas de seguridad activas hoy en el proyecto Firebase `fir-invitacion`? No se pudieron revisar desde este repositorio y son necesarias para saber si hay una exposición de datos activa en producción.
5. La sincronización entre dispositivos (mesas, lista de invitados) hoy **no funciona** — solo vive en `localStorage` del navegador donde se editó. ¿Era un comportamiento esperado/aceptado hasta ahora, o se asumía que sí sincronizaba?
6. Los enlaces personalizados y los QR del admin apuntan a `ivan-gemima/`, no a la propia invitación demo — ¿es intencional (este admin en realidad administra al cliente real Iván & Gemima y la demo es solo una copia de respaldo) o es un resto de una migración que debería apuntar a `index.html`?
7. ¿Se conservan las funciones de gender reveal y wishlist de cumpleaños (activadas por `?tipo=`) en el sistema nuevo, o fueron solo un experimento puntual?
8. Dado que "Editar evento" no tiene efecto real hoy, ¿el sistema nuevo debe hacer que **todos** los campos (fecha, iglesia, salón, fecha límite) funcionen de punta a punta como ya lo hace "Mesa de regalos"?

---

## 10. Capturas

Se generaron **46 capturas** (23 pantallas × 2 anchos: 375px y 1440px) con Playwright contra un servidor local (`python3 -m http.server`), usando **datos de prueba** (los mismos `WEDDING_GUESTS`/`LOCAL_RSVP` de ejemplo que ya trae el código) — nunca datos de invitados reales. Guardadas en `docs/admin-actual/capturas/`.

Nota metodológica: este sandbox no tiene salida de red hacia `gstatic.com`, así que Firebase real no carga. Para que las capturas del admin reflejen la misma rama de código que producción (con `db` disponible, en vez de la pantalla de "Sin conexión a Firestore"), se inyectó un stub local del SDK de Firebase antes de cargar la página — no se tocó ningún dato ni archivo del repositorio.

**Invitación** (`inv-NN-sección-ANCHO.png`):
`inv-01-portada`, `inv-02-hero`, `inv-03-contador`, `inv-04-fecha-calendario`, `inv-05-horario`, `inv-06-ubicaciones`, `inv-07-galeria`, `inv-08-historia`, `inv-09-rsvp`, `inv-10-regalos`, `inv-11-musica`, `inv-12-dresscode`, `inv-13-calendario-cta`, `inv-14-footer` — cada una en `-375.png` y `-1440.png`.

**Panel admin** (`admin-NN-pantalla-ANCHO.png`):
`admin-01-login`, `admin-02-resumen`, `admin-03-invitados`, `admin-04-mesas`, `admin-05-actividad`, `admin-06-enlaces`, `admin-07-mensajes`, `admin-08-regalos`, `admin-09-editar-evento` — cada una en `-375.png` y `-1440.png`.
