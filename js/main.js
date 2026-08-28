    /* =========================================================
   Freiwillige Feuerwehr Ahornberg – Haupt-JavaScript
   ========================================================= */

/* ---------- Footer-Jahr automatisch aktuell halten ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------- Mobile Navigation ---------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');

hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    });
});

/* ---------- Sanftes Scrollen für Anker-Links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ---------- Header-Effekt beim Scrollen ---------- */
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/* ---------- Scroll-Reveal für Karten & Einsatzliste ---------- */
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .deployment-list li').forEach(element => {
    element.classList.add('reveal');
    observer.observe(element);
});

/* ---------- Notruf-Nummer: Blinken bei Klick ---------- */
const emergencyNumber = document.querySelector('.emergency-number');
if (emergencyNumber) {
    emergencyNumber.addEventListener('click', () => {
        emergencyNumber.style.animation = 'none';
        setTimeout(() => {
            emergencyNumber.style.animation = 'emergencyBlink 1s ease-in-out 3';
        }, 10);
    });
}

/* ---------- CTA-Button ---------- */
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function () {
        this.dataset.text = this.textContent;
        this.textContent = '🚒 ' + this.textContent;
    });
    ctaButton.addEventListener('mouseleave', function () {
        if (this.dataset.text) this.textContent = this.dataset.text;
    });
}

/* ---------- Wetter-Widget ---------- */
async function loadWeather() {
    const weatherInfo = document.getElementById('weather-info');
    if (!weatherInfo) return;
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=50.2167&longitude=11.9167&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl&timezone=Europe/Berlin&forecast_days=1');
        const data = await response.json();
        const current = data.current_weather;
        const hourly = data.hourly;
        const currentHour = new Date().getHours();
        const humidity = hourly.relative_humidity_2m[currentHour] || 'N/A';
        const pressure = hourly.pressure_msl[currentHour] || 'N/A';
        const weatherDescriptions = {
            0: 'Klar', 1: 'Überwiegend klar', 2: 'Teilweise bewölkt', 3: 'Bewölkt',
            45: 'Neblig', 48: 'Neblig mit Reif', 51: 'Leichter Nieselregen',
            53: 'Mäßiger Nieselregen', 55: 'Starker Nieselregen', 61: 'Leichter Regen',
            63: 'Mäßiger Regen', 65: 'Starker Regen', 71: 'Leichter Schneefall',
            73: 'Mäßiger Schneefall', 75: 'Starker Schneefall', 77: 'Schneekörner',
            80: 'Leichte Regenschauer', 81: 'Mäßige Regenschauer', 82: 'Starke Regenschauer',
            85: 'Leichte Schneeschauer', 86: 'Starke Schneeschauer', 95: 'Gewitter',
            96: 'Gewitter mit Hagel', 99: 'Starkes Gewitter mit Hagel'
        };
        const description = weatherDescriptions[current.weathercode] || 'Unbekannt';
        weatherInfo.innerHTML = `
            <div class="weather-temp">${Math.round(current.temperature)}°C</div>
            <div class="weather-desc">${description}</div>
            <div class="weather-data">
                <div class="weather-item"><div>💧 Luftfeuchtigkeit</div><div class="weather-value">${humidity}%</div></div>
                <div class="weather-item"><div>💨 Wind</div><div class="weather-value">${Math.round(current.windspeed)} km/h</div></div>
                <div class="weather-item"><div>📊 Luftdruck</div><div class="weather-value">${pressure ? Math.round(pressure) : 'N/A'} hPa</div></div>
            </div>
            <div class="weather-timestamp">Live-Daten für Ahornberg • ${new Date().toLocaleString('de-DE')}</div>
        `;
    } catch (error) {
        weatherInfo.innerHTML = '<p class="weather-error">🌡️ Wetterdaten momentan nicht verfügbar<br><small>Verbindung zur Wetter-API fehlgeschlagen</small></p>';
    }
}
loadWeather();
setInterval(loadWeather, 600000);

/* ---------- Galerie-Modals ---------- */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function fillGallery(galleryId, basePath, count, prefix, ext) {
    const gallery = document.getElementById(galleryId);
    if (!gallery) return;
    gallery.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        const img = document.createElement('img');
        img.src = `${basePath}${i}.${ext}`;
        img.alt = `${prefix} Bild ${i}`;
        img.loading = 'lazy';
        gallery.appendChild(img);
    }
}

const modalConfigs = {
    '.open-drehleiter-modal': {
        modal: 'imageModal', gallery: 'drehleiterGallery',
        base: 'pics/drehleiteruebung/drehleiteruebung', count: 8, prefix: 'Drehleiterübung', ext: 'webp'
    },
    '.open-funkuebung-modal': {
        modal: 'funkuebungModal', gallery: 'funkuebungGallery',
        base: 'pics/funkübung/', count: 2, prefix: 'Funkübung', ext: 'webp'
    },
    '.open-fahrzeugkunde-modal': {
        modal: 'fahrzeugkundeModal', gallery: 'fahrzeugkundeGallery',
        base: 'pics/Fahrzeugkunde/', count: 3, prefix: 'Fahrzeugkunde', ext: 'webp'
    },
    '.open-5mai26-modal': {
        modal: '5mai26Modal', gallery: '5mai26Gallery',
        base: 'pics/5mai26/', count: 13, prefix: 'Scheunenbrand', ext: 'jpeg'
    },
    '.open-sommerevent-modal': {
        modal: 'sommereventModal', gallery: 'sommereventGallery',
        base: 'pics/16august26/Screenshot_', count: 3, prefix: 'Sommer-Event', ext: 'webp'
    }
};

Object.entries(modalConfigs).forEach(([selector, config]) => {
    document.querySelectorAll(selector).forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            fillGallery(config.gallery, config.base, config.count, config.prefix, config.ext);
            openModal(config.modal);
        });
    });
});

// Schließen über die Close-Buttons (data-modal-Attribut)
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', () => {
        closeModal(button.dataset.modal);
    });
});

// Schließen durch Klick auf den Hintergrund
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Schließen mit Escape-Taste
function closeOpenModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeOpenModals();
        closeLightbox();
    }
});

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');

function openLightbox(img, caption) {
    if (!img || !img.src) return;
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || '';
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImage.src = '';
    document.body.style.overflow = '';
}

// Klick auf ein Galerie-/Modal-Bild öffnet die Lightbox
document.addEventListener('click', (event) => {
    const img = event.target.closest('img');
    if (!img) return;
    const galleryImage = img.closest('.gallery-item') || img.closest('.modal-gallery-grid');
    if (!galleryImage) return;

    const wrapper = img.closest('a');
    if (wrapper && wrapper.classList.contains('gallery-item-link')) {
        // Sommer-Event-Galerie-Element: Modal öffnen statt Lightbox
        return;
    }

    const itemCaption = img.closest('.gallery-item')?.querySelector('.gallery-overlay h3');
    const caption = itemCaption ? itemCaption.textContent.trim() : img.alt || '';
    openLightbox(img, caption);
});

// Schließen über den Close-Button
lightbox.querySelector('.lightbox-close').addEventListener('click', (event) => {
    event.stopPropagation();
    closeLightbox();
});

// Schließen durch Klick auf den Hintergrund (nicht auf das Bild)
lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target === lightboxImage) {
        closeLightbox();
    }
});

/* ---------- Scroll-to-top Button ---------- */
const scrollTopBtn = document.getElementById('scrollTopBtn');

function updateScrollTopButton() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
}

window.addEventListener('scroll', updateScrollTopButton, { passive: true });
updateScrollTopButton();

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---------- Leichtgewichtiger Datenschutz-Hinweis ---------- */
const privacyBanner = document.getElementById('privacyBanner');
const privacyAccept = document.getElementById('privacyAccept');

function showPrivacyBanner() {
    if (!privacyBanner) return;
    try {
        if (localStorage.getItem('ffw-privacy-consent') === 'accepted') return;
    } catch (error) {
        return; // localStorage nicht verfügbar -> Banner nicht anzeigen
    }
    setTimeout(() => privacyBanner.classList.add('show'), 1500);
}

if (privacyAccept) {
    privacyAccept.addEventListener('click', () => {
        try {
            localStorage.setItem('ffw-privacy-consent', 'accepted');
        } catch (error) {
            /* weiter im Speichermodus */
        }
        privacyBanner.classList.remove('show');
    });
}

showPrivacyBanner();

/* ---------- Einsatz-Statistik ---------- */
function initDeploymentStats() {
    const statsEl = document.getElementById('deploymentStats');
    const list = document.querySelector('.deployment-list');
    if (!statsEl || !list) return;

    const items = list.querySelectorAll('li');
    if (items.length === 0) return;

    const years = new Set();
    items.forEach((li) => {
        const strongText = li.querySelector('strong')?.textContent || '';
        const match = strongText.match(/(\d{4})/);
        if (match) years.add(match[1]);
    });

    const yearList = Array.from(years).sort();
    const yearRange = yearList.length > 1
        ? yearList[0] + '–' + yearList[yearList.length - 1]
        : (yearList[0] || String(new Date().getFullYear()));

    statsEl.innerHTML = '<span class="stat-item">🚒 <strong>' + items.length + '</strong> dokumentierte Einsätze</span>' +
        '<span class="stat-item">📅 ' + yearRange + '</span>';
}

initDeploymentStats();
