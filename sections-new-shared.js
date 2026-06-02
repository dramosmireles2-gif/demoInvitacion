(function() {
  const DEFAULT_CONFIG_NEW = {
    weddingDate: '2027-10-02T17:00:00',
    schedule: [
      { icon: '⛪', label: 'Ceremonia religiosa', place: 'Aposento Alto', time: '15:00 HRS' },
      { icon: '🥂', label: 'Recepcion', place: 'Hacienda San Antonio Calichar', time: '17:00 HRS' },
      { icon: '🎉', label: 'Baile y festejo', place: 'Hacienda San Antonio Calichar', time: '18:00 HRS' },
      { icon: '🌙', label: 'Cierre de fiesta', place: '', time: '01:00 HRS' },
    ],
    church: {
      name: 'Aposento Alto',
      address: 'C. Insurgentes 418, Chapultepec, 66450 San Nicol\u00e1s de los Garza, N.L.',
      mapEmbed: 'https://maps.google.com/maps?q=Aposento+Alto+Insurgentes+418+San+Nicolas+de+los+Garza+NL+Mexico&output=embed',
      mapsLink: 'https://maps.app.goo.gl/enaa51eixmTVXXjJA',
    },
    churchImage: './Iglesia.png',
    venueImage: './Salon.png',
    music: './musica.mp3',
    gallery: [],
    dresscode: {
      women: { style: 'Vestido largo o coctel', colors: ['#d8c4a4', '#c4b09a', '#8f8f8f', '#6b6b6b'], note: 'Evitar blanco e ivory' },
      men: { style: 'Traje formal', colors: ['#1f1f1f', '#4a4a4a', '#8e8e8e', '#b8976a'], note: 'Corbata o mono sugerido' },
    },
    gifts: { showBank: true, bankName: 'BBVA', bankClabe: '000000000000000000', bankAlias: 'andrea.saul.boda', giftListUrl: '' },
    wishlist: [{ name: 'Item de ejemplo', price: '$500', image: '', link: '' }],
  };

  const STATE_NEW = {
    config: null,
    tipo: '',
    galleryIndex: 0,
    genderVotes: { boy: 0, girl: 0 },
  };

  function getConfigNew() {
    return STATE_NEW.config || DEFAULT_CONFIG_NEW;
  }

  function getTipoNew() {
    return STATE_NEW.tipo;
  }

  function getFirestoreModeNew() {
    if (typeof db !== 'undefined' && db && typeof db.collection === 'function' && typeof firebase !== 'undefined') return 'compat';
    if (window._db && window._firestoreHelpers && typeof window._firestoreHelpers.doc === 'function') return 'modular';
    return '';
  }

  function mountWeddingSectionsNew() {
    const beforeGuest = document.getElementById('pre-guest-sections-new');
    const beforeFooter = document.getElementById('pre-footer-sections-new');
    const cfg = getConfigNew();

    if (beforeGuest) {
      beforeGuest.innerHTML = `
        <audio id="bg-music-new" loop preload="none"><source id="bg-music-source-new" src="" type="audio/mpeg"></audio>
        <button id="music-btn-new" class="music-btn-new" type="button" title="Musica">♪</button>
        <div id="lightbox-new">
          <button id="lightbox-close-new" type="button">&times;</button>
          <button id="lightbox-prev-new" class="lightbox-btn-new" type="button">‹</button>
          <img id="lightbox-img-new" src="" alt="Galeria">
          <button id="lightbox-next-new" class="lightbox-btn-new" type="button">›</button>
          <span id="lightbox-counter-new"></span>
        </div>

        <section class="inv-block-new">
          <div class="mini-cal-new panel-new">
            <p class="mini-cal-month-new">Octubre 2027</p>
            <div class="mini-cal-grid-new" id="mini-cal-grid-new"></div>
          </div>
        </section>

        <section class="inv-block-new">
          <p class="section-kicker-new">El gran dia</p>
          <div class="timeline-list-new" id="timeline-list-new"></div>
        </section>

        <div class="inv-block-new"><div class="separator-new"></div></div>

        <section class="inv-block-new">
          <p class="section-kicker-new">Donde nos encontramos</p>
          <div class="location-stack-new">
            <article class="location-card-new">
              <p class="location-card-label-new">Ceremonia religiosa · 15:00 HRS</p>
              <div class="location-card-photo-new" id="church-photo-new" style="display:none;">
                <img src="" alt="Aposento Alto" loading="lazy">
              </div>
              <span class="location-card-name-new" id="church-name-new">Aposento Alto</span>
              <span class="location-card-address-new" id="church-address-new"></span>
              <a class="location-directions-btn-new" id="church-directions-new" href="#" target="_blank" rel="noreferrer">📍 Como llegar</a>
              <div id="church-map-container-new"></div>
            </article>

            <article class="transfer-card-new">
              <span class="transfer-icon-new">🚗</span>
              <p class="transfer-label-new">Traslado</p>
              <p class="transfer-title-new">Rumbo a la recepcion</p>
              <span class="transfer-copy-new">Aproximadamente 18 min en automovil despues de la ceremonia.</span>
            </article>

            <article class="location-card-new">
              <p class="location-card-label-new">Recepcion · 17:00 HRS</p>
              <div class="location-card-photo-new" id="venue-photo-new" style="display:none;">
                <img src="" alt="Hacienda San Antonio Calichar" loading="lazy">
              </div>
              <span class="location-card-name-new">Hacienda San Antonio Calichar</span>
              <span class="location-card-address-new">Carretera Reynosa-San Fernando km 12, Tamaulipas</span>
              <a class="location-directions-btn-new" href="https://maps.google.com/?q=Hacienda+San+Antonio+Calichar+Tamaulipas" target="_blank" rel="noreferrer">📍 Como llegar</a>
              <iframe class="location-card-map-new" src="https://maps.google.com/maps?q=Hacienda+San+Antonio+Calichar+Tamaulipas&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Hacienda San Antonio Calichar"></iframe>
            </article>
          </div>
        </section>

        <section class="inv-block-new" id="gallery-section-new" style="display:none;">
          <p class="section-kicker-new">Nuestra historia</p>
          <div class="gallery-grid-new" id="gallery-grid-new"></div>
        </section>

        <section class="inv-block-new">
          <p class="section-kicker-new">Codigo de vestimenta</p>
          <div class="dresscode-grid-new" id="dresscode-grid-new"></div>
        </section>

        <section class="inv-block-new">
          <div class="no-pets-card-new">
            <span class="no-pets-icon-new"><svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="10" rx="3" ry="4" stroke="currentColor" stroke-width="1.3" fill="rgba(184,151,106,0.12)"/><ellipse cx="22" cy="10" rx="3" ry="4" stroke="currentColor" stroke-width="1.3" fill="rgba(184,151,106,0.12)"/><path d="M8 20C8 14 10 12 14 12H22C26 12 28 14 28 20C28 24 26 26 22 27L20 30H16L14 27C10 26 8 24 8 20Z" stroke="currentColor" stroke-width="1.3" fill="rgba(184,151,106,0.1)"/><ellipse cx="7" cy="17" rx="2.5" ry="3.5" stroke="currentColor" stroke-width="1.1" fill="rgba(184,151,106,0.08)"/><ellipse cx="29" cy="17" rx="2.5" ry="3.5" stroke="currentColor" stroke-width="1.1" fill="rgba(184,151,106,0.08)"/></svg></span>
            <span class="no-pets-text-new" id="no-pets-text-new"></span>
          </div>
        </section>
      `;
    }

    if (beforeFooter) {
      beforeFooter.innerHTML = `
        <section class="inv-block-new">
          <p class="section-kicker-new">Mesa de regalos</p>
          <span class="gifts-copy-new">El mejor regalo es compartir este dia con nosotros, pero si deseas hacernos un obsequio, aqui tienes nuestra CLABE.</span>
          <div class="bank-card-new" id="bank-card-new" style="display:none;">
            <p class="bank-name-new" id="bank-name-new"></p>
            <p class="bank-clabe-new" id="bank-clabe-new"></p>
            <p class="bank-alias-new" id="bank-alias-new"></p>
            <button class="bank-copy-btn-new" id="bank-copy-btn-new" type="button" onclick="copyBankNew()">Copiar CLABE</button>
            <a class="gift-list-btn-new" id="gift-list-btn-new" href="#" target="_blank" rel="noreferrer" style="display:none;">Ver gift list</a>
          </div>
        </section>

        <section class="inv-block-new" id="section-wishlist-new" style="display:none;">
          <p class="section-kicker-new">Lista de deseos</p>
          <div class="wishlist-grid-new" id="wishlist-grid-new"></div>
        </section>

        <section class="inv-block-new" id="section-gender-new" style="display:none;">
          <div class="gender-card-new">
            <p class="section-kicker-new">Gran revelacion</p>
            <p class="gender-title-new">Nino o nina</p>
            <span class="gender-copy-new">Vota tu prediccion y descubre como va la tendencia.</span>
            <div class="gender-actions-new">
              <button class="gender-btn-new" id="gender-boy-new" type="button" onclick="voteGenderNew('boy')">👦 Nino</button>
              <button class="gender-btn-new" id="gender-girl-new" type="button" onclick="voteGenderNew('girl')">👧 Nina</button>
            </div>
            <div class="gender-bars-new" id="gender-bars-new">
              <div class="gender-bar-row-new"><span>Nino</span><div class="gender-bar-track-new"><div class="gender-bar-fill-new" id="bar-boy-new" style="background:var(--boy-new, #6f95c9);"></div></div><span id="pct-boy-new">0%</span></div>
              <div class="gender-bar-row-new"><span>Nina</span><div class="gender-bar-track-new"><div class="gender-bar-fill-new" id="bar-girl-new" style="background:var(--girl-new, #c96fa2);"></div></div><span id="pct-girl-new">0%</span></div>
            </div>
            <p class="gender-total-new" id="gender-total-new">0 votos</p>
          </div>
        </section>

        <section class="inv-block-new">
          <div class="cal-cta-card-new">
            <p class="section-kicker-new">Agenda la fecha</p>
            <p class="cal-cta-title-new">Aparta el 02 de Octubre 2027</p>
            <span class="cal-cta-sub-new">Guarda la ceremonia y recepcion en tu calendario favorito.</span>
            <div class="cal-btns-new">
              <a class="cal-btn-new" id="gcal-btn-new" href="#" target="_blank" rel="noreferrer">Google Calendar</a>
              <button class="cal-btn-new" type="button" onclick="downloadICSNew('apple')">Apple Calendar</button>
              <button class="cal-btn-new" type="button" onclick="downloadICSNew('outlook')">Outlook</button>
            </div>
          </div>
        </section>
      `;
    }

    const musicSource = document.getElementById('bg-music-source-new');
    const music = document.getElementById('bg-music-new');
    if (musicSource && music) {
      musicSource.src = cfg.music;
      music.load();
    }
  }

  window.buildMiniCalendarNew = function() {
    const grid = document.getElementById('mini-cal-grid-new');
    if (!grid) return;
    const heads = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    grid.innerHTML = '';
    heads.forEach(function(day) {
      const el = document.createElement('div');
      el.className = 'mini-cal-head-new';
      el.textContent = day;
      grid.appendChild(el);
    });
    const firstDay = new Date(2027, 9, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < offset; i += 1) {
      const el = document.createElement('div');
      el.className = 'mini-cal-day-new empty';
      el.textContent = '·';
      grid.appendChild(el);
    }
    for (let day = 1; day <= 31; day += 1) {
      const el = document.createElement('div');
      el.className = 'mini-cal-day-new' + (day === 2 ? ' today' : '');
      el.textContent = String(day);
      grid.appendChild(el);
    }
  };

  window.buildTimelineNew = function() {
    const list = document.getElementById('timeline-list-new');
    if (!list) return;
    list.innerHTML = getConfigNew().schedule.map(function(item) {
      return `
        <article class="timeline-item-new">
          <div class="timeline-dot-new">${item.icon}</div>
          <div class="timeline-content-new">
            <span class="timeline-time-new">${item.time}</span>
            <span class="timeline-label-new">${item.label}</span>
            ${item.place ? `<span class="timeline-place-new">${item.place}</span>` : ''}
          </div>
        </article>
      `;
    }).join('');
  };

  window.buildLocationsNew = function() {
    const cfg = getConfigNew().church;
    const nameEl = document.getElementById('church-name-new');
    const addrEl = document.getElementById('church-address-new');
    const dirEl = document.getElementById('church-directions-new');
    if (nameEl) nameEl.textContent = cfg.name;
    if (addrEl) addrEl.textContent = cfg.address;
    if (dirEl) dirEl.href = cfg.mapsLink;
    const churchMap = document.getElementById('church-map-container-new');
    if (churchMap) {
      churchMap.innerHTML = `<iframe class="location-card-map-new" src="${cfg.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${cfg.name}"></iframe>`;
    }
    const churchPhoto = document.getElementById('church-photo-new');
    if (churchPhoto && getConfigNew().churchImage) {
      churchPhoto.style.display = 'block';
      churchPhoto.querySelector('img').src = getConfigNew().churchImage;
    }
    const venuePhoto = document.getElementById('venue-photo-new');
    if (venuePhoto && getConfigNew().venueImage) {
      venuePhoto.style.display = 'block';
      venuePhoto.querySelector('img').src = getConfigNew().venueImage;
    }
  };

  window.buildGalleryNew = function() {
    const section = document.getElementById('gallery-section-new');
    const grid = document.getElementById('gallery-grid-new');
    const gallery = getConfigNew().gallery || [];
    if (!section || !grid || !gallery.length) return;
    section.style.display = 'block';
    grid.innerHTML = gallery.map(function(src, index) {
      return `<img class="gallery-img-new" src="${src}" alt="Foto ${index + 1}" loading="lazy" onclick="openLightboxNew(${index})">`;
    }).join('');
  };

  window.openLightboxNew = function(index) {
    STATE_NEW.galleryIndex = index;
    window.updateLightboxNew();
    const lightbox = document.getElementById('lightbox-new');
    if (lightbox) lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightboxNew = function() {
    const lightbox = document.getElementById('lightbox-new');
    if (lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.updateLightboxNew = function() {
    const img = document.getElementById('lightbox-img-new');
    const counter = document.getElementById('lightbox-counter-new');
    const gallery = getConfigNew().gallery || [];
    if (img) img.src = gallery[STATE_NEW.galleryIndex] || '';
    if (counter) counter.textContent = `${STATE_NEW.galleryIndex + 1} / ${gallery.length}`;
  };

  function bindLightboxNew() {
    const lightbox = document.getElementById('lightbox-new');
    if (!lightbox) return;
    document.getElementById('lightbox-close-new')?.addEventListener('click', window.closeLightboxNew);
    document.getElementById('lightbox-prev-new')?.addEventListener('click', function() {
      const gallery = getConfigNew().gallery || [];
      STATE_NEW.galleryIndex = (STATE_NEW.galleryIndex - 1 + gallery.length) % gallery.length;
      window.updateLightboxNew();
    });
    document.getElementById('lightbox-next-new')?.addEventListener('click', function() {
      const gallery = getConfigNew().gallery || [];
      STATE_NEW.galleryIndex = (STATE_NEW.galleryIndex + 1) % gallery.length;
      window.updateLightboxNew();
    });
    lightbox.addEventListener('click', function(event) {
      if (event.target === lightbox) window.closeLightboxNew();
    });
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', function(event) {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function(event) {
      const gallery = getConfigNew().gallery || [];
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) < 40 || !gallery.length) return;
      STATE_NEW.galleryIndex = delta < 0
        ? (STATE_NEW.galleryIndex + 1) % gallery.length
        : (STATE_NEW.galleryIndex - 1 + gallery.length) % gallery.length;
      window.updateLightboxNew();
    }, { passive: true });
  }

  window.buildDresscodeNew = function() {
    const grid = document.getElementById('dresscode-grid-new');
    if (!grid) return;
    const dresscode = getConfigNew().dresscode;
    const dress = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6C15 6 12 10 10 14L6 28H38L34 14C32 10 29 6 29 6L25 10L22 8L19 10Z" stroke="currentColor" stroke-width="1.4" fill="rgba(184,151,106,0.12)" stroke-linejoin="round"/><path d="M16 28L14 40H30L28 28" stroke="currentColor" stroke-width="1.4" fill="rgba(184,151,106,0.08)" stroke-linejoin="round"/><ellipse cx="22" cy="7" rx="3" ry="3.5" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>';
    const suit = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 8L8 20L14 22V40H30V22L36 20L30 8L26 14L22 10L18 14Z" stroke="currentColor" stroke-width="1.4" fill="rgba(184,151,106,0.12)" stroke-linejoin="round"/><path d="M18 14L22 10L26 14" stroke="currentColor" stroke-width="1.1"/><line x1="22" y1="18" x2="22" y2="36" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/></svg>';
    const items = [
      { label: 'Damas', icon: dress, data: dresscode.women },
      { label: 'Caballeros', icon: suit, data: dresscode.men },
    ];
    grid.innerHTML = items.map(function(item) {
      return `
        <article class="dresscode-card-new">
          <span class="dresscode-icon-new">${item.icon}</span>
          <p class="dresscode-gender-new">${item.label}</p>
          <p class="dresscode-style-new">${item.data.style}</p>
          <div class="dresscode-colors-new">${item.data.colors.map(function(color) { return `<span class="color-swatch-new" style="background:${color}"></span>`; }).join('')}</div>
          <span class="dresscode-note-new">${item.data.note}</span>
        </article>
      `;
    }).join('');
  };

  window.buildNoPetsNew = function() {
    const text = document.getElementById('no-pets-text-new');
    if (text) text.textContent = 'Agradecemos tu comprension: el evento es libre de mascotas.';
  };

  window.buildGiftsNew = function() {
    const card = document.getElementById('bank-card-new');
    if (!card) return;
    const gifts = getConfigNew().gifts;
    card.style.display = gifts.showBank ? 'block' : 'none';
    document.getElementById('bank-name-new').textContent = gifts.bankName;
    document.getElementById('bank-clabe-new').textContent = gifts.bankClabe;
    document.getElementById('bank-alias-new').textContent = `Alias: ${gifts.bankAlias}`;
    const giftBtn = document.getElementById('gift-list-btn-new');
    if (giftBtn && gifts.giftListUrl) {
      giftBtn.href = gifts.giftListUrl;
      giftBtn.style.display = 'inline-flex';
    }
  };

  window.copyBankNew = function() {
    const clabe = getConfigNew().gifts.bankClabe;
    const btn = document.getElementById('bank-copy-btn-new');
    const onCopied = function() {
      if (!btn) return;
      btn.textContent = 'CLABE copiada';
      btn.classList.add('copied');
      window.setTimeout(function() {
        btn.textContent = 'Copiar CLABE';
        btn.classList.remove('copied');
      }, 2200);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(clabe).then(onCopied).catch(function() {});
      return;
    }
    const area = document.createElement('textarea');
    area.value = clabe;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    onCopied();
  };

  window.buildWishlistNew = function() {
    if (getTipoNew() !== 'cumple') return;
    const section = document.getElementById('section-wishlist-new');
    const grid = document.getElementById('wishlist-grid-new');
    if (!section || !grid) return;
    section.style.display = 'block';
    grid.innerHTML = getConfigNew().wishlist.map(function(item) {
      return `
        <article class="wishlist-item-new">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy">` : '<div class="wishlist-image-placeholder-new">&#127873;</div>'}
          <p class="wishlist-name-new">${item.name}</p>
          <p class="wishlist-price-new">${item.price}</p>
          ${item.link ? `<a class="wishlist-link-new" href="${item.link}" target="_blank" rel="noreferrer">Ver producto</a>` : ''}
        </article>
      `;
    }).join('');
  };

  function watchGenderVotesNew(callback) {
    const mode = getFirestoreModeNew();
    if (mode === 'compat') {
      return db.collection('gender_reveal').doc('votes').onSnapshot(function(snapshot) {
        callback(snapshot.exists ? snapshot.data() : { boy: 0, girl: 0 });
      });
    }
    if (mode === 'modular') {
      const helpers = window._firestoreHelpers;
      if (typeof helpers.onSnapshot === 'function') {
        return helpers.onSnapshot(helpers.doc(window._db, 'gender_reveal', 'votes'), function(snapshot) {
          callback(snapshot.exists() ? snapshot.data() : { boy: 0, girl: 0 });
        });
      }
    }
    return null;
  }

  function updateGenderBarsNew(boy, girl) {
    STATE_NEW.genderVotes = { boy: boy, girl: girl };
    const total = boy + girl;
    const safeTotal = total || 1;
    const boyPct = Math.round((boy / safeTotal) * 100);
    const girlPct = Math.round((girl / safeTotal) * 100);
    const boyBar = document.getElementById('bar-boy-new');
    const girlBar = document.getElementById('bar-girl-new');
    if (boyBar) boyBar.style.width = `${boyPct}%`;
    if (girlBar) girlBar.style.width = `${girlPct}%`;
    const boyPctEl = document.getElementById('pct-boy-new');
    const girlPctEl = document.getElementById('pct-girl-new');
    if (boyPctEl) boyPctEl.textContent = `${boyPct}%`;
    if (girlPctEl) girlPctEl.textContent = `${girlPct}%`;
    const totalEl = document.getElementById('gender-total-new');
    if (totalEl) totalEl.textContent = `${total} ${total === 1 ? 'voto' : 'votos'}`;
  }

  function disableGenderButtonsNew() {
    document.getElementById('gender-boy-new')?.setAttribute('disabled', 'disabled');
    document.getElementById('gender-girl-new')?.setAttribute('disabled', 'disabled');
  }

  function spawnGenderConfettiNew(color) {
    for (let i = 0; i < 24; i += 1) {
      window.setTimeout(function() {
        const dot = document.createElement('span');
        dot.className = 'gender-confetti-new';
        dot.style.left = `${Math.random() * 100}vw`;
        dot.style.background = color;
        document.body.appendChild(dot);
        window.setTimeout(function() { dot.remove(); }, 2400);
      }, i * 40);
    }
  }

  window.buildGenderRevealNew = function() {
    if (getTipoNew() !== 'genero') return;
    const section = document.getElementById('section-gender-new');
    if (!section) return;
    section.style.display = 'block';
    const storageKey = `gender_voted_new_${window.location.pathname}`;
    const voted = localStorage.getItem(storageKey);
    if (voted) disableGenderButtonsNew();
    const unsubscribe = watchGenderVotesNew(function(data) {
      updateGenderBarsNew(data.boy || 0, data.girl || 0);
    });
    if (!unsubscribe) {
      updateGenderBarsNew(voted === 'boy' ? 1 : 0, voted === 'girl' ? 1 : 0);
    }
  };

  window.voteGenderNew = async function(choice) {
    const storageKey = `gender_voted_new_${window.location.pathname}`;
    if (localStorage.getItem(storageKey)) return;
    localStorage.setItem(storageKey, choice);
    disableGenderButtonsNew();
    spawnGenderConfettiNew(choice === 'boy' ? 'var(--boy-new, #6f95c9)' : 'var(--girl-new, #c96fa2)');
    const nextVotes = {
      boy: STATE_NEW.genderVotes.boy + (choice === 'boy' ? 1 : 0),
      girl: STATE_NEW.genderVotes.girl + (choice === 'girl' ? 1 : 0),
    };
    updateGenderBarsNew(nextVotes.boy, nextVotes.girl);
    const mode = getFirestoreModeNew();
    if (mode === 'compat') {
      try {
        await db.collection('gender_reveal').doc('votes').set({ [choice]: firebase.firestore.FieldValue.increment(1) }, { merge: true });
      } catch (error) {
        console.error(error);
      }
      return;
    }
    if (mode === 'modular') {
      const helpers = window._firestoreHelpers;
      if (typeof helpers.setDoc === 'function' && typeof helpers.increment === 'function') {
        try {
          await helpers.setDoc(helpers.doc(window._db, 'gender_reveal', 'votes'), { [choice]: helpers.increment(1) }, { merge: true });
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  window.buildCalendarCtaNew = function() {
    const start = '20271002T170000';
    const end = '20271003T010000';
    const googleUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=Boda+Andrea+%26+Sa%C3%BAl'
      + `&dates=${start}/${end}`
      + '&location=Hacienda+San+Antonio+Calichar,+Tamaulipas'
      + '&details=Ceremonia+religiosa+15:00+HRS+en+Aposento+Alto.+Recepcion+17:00+HRS+en+Hacienda+San+Antonio+Calichar.';
    const button = document.getElementById('gcal-btn-new');
    if (button) button.href = googleUrl;
  };

  window.downloadICSNew = function(provider) {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Andrea & Sa\u00fal//Boda 2027//ES',
      'BEGIN:VEVENT',
      'DTSTART:20271002T170000',
      'DTEND:20271003T010000',
      'SUMMARY:Boda Andrea & Sa\u00fal',
      'DESCRIPTION:Ceremonia religiosa 15:00 HRS en Aposento Alto. Recepcion 17:00 HRS en Hacienda San Antonio Calichar.',
      'LOCATION:Hacienda San Antonio Calichar\\, Tamaulipas',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `andrea-saul-${provider}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  function initMusicNew() {
    const music = document.getElementById('bg-music-new');
    const btn = document.getElementById('music-btn-new');
    if (!music || !btn) return;
    window._musicStartedNew = false;
    btn.addEventListener('click', function() {
      if (music.paused) {
        music.play().catch(function() {});
        btn.textContent = '⏸';
        btn.classList.add('playing');
      } else {
        music.pause();
        btn.textContent = '♪';
        btn.classList.remove('playing');
      }
    });
    window._startMusicNew = function() {
      btn.style.display = 'inline-flex';
      if (window._musicStartedNew) return;
      window._musicStartedNew = true;
      music.play().catch(function() {});
      btn.textContent = '⏸';
      btn.classList.add('playing');
    };
  }

  window.initWeddingSectionsNew = function(config) {
    STATE_NEW.config = Object.assign({}, DEFAULT_CONFIG_NEW, config || {});
    STATE_NEW.tipo = (new URLSearchParams(window.location.search).get('tipo') || '').toLowerCase().trim();
    STATE_NEW.galleryIndex = 0;
    STATE_NEW.genderVotes = { boy: 0, girl: 0 };
    mountWeddingSectionsNew();
    initMusicNew();
    bindLightboxNew();
    window.buildMiniCalendarNew();
    window.buildTimelineNew();
    window.buildLocationsNew();
    window.buildGalleryNew();
    window.buildDresscodeNew();
    window.buildNoPetsNew();
    window.buildGiftsNew();
    window.buildWishlistNew();
    window.buildGenderRevealNew();
    window.buildCalendarCtaNew();
    window._refreshGenderRevealNew = window.buildGenderRevealNew;
  };
})();
