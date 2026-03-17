/* ═══════════════════════════════════════════════════════════════
   script.js — Evolución de la Arquitectura Web
   SPA Vanilla JS — sin dependencias externas
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── CONSTANTES ───────────────────────────────────────────────
const SECTION_IDS = ['web10', 'web20', 'mobile', 'modern'];

// ─── NAVEGACIÓN PRINCIPAL ─────────────────────────────────────

/**
 * Muestra la sección indicada y oculta las demás.
 * Agrega .active al botón de navegación correspondiente.
 * @param {string} targetId  — ID de la sección a mostrar
 * @param {HTMLElement} btn  — botón clickeado (puede ser null)
 */
function showSection(targetId, btn) {
  // Ocultar todas las secciones
  SECTION_IDS.forEach(id => {
    const section = document.getElementById(id);
    if (section) section.classList.add('hidden');
  });

  // Mostrar la sección objetivo
  const target = document.getElementById(targetId);
  if (target) target.classList.remove('hidden');

  // Actualizar estado del botón activo
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  } else {
    // Activar el botón correspondiente si no se pasó referencia
    const idx = SECTION_IDS.indexOf(targetId);
    const buttons = document.querySelectorAll('.nav-btn');
    if (buttons[idx]) buttons[idx].classList.add('active');
  }

  // Acciones especiales por sección
  if (targetId === 'modern') {
    // Disparar skeleton loaders al entrar a Web Moderna
    setTimeout(triggerSkeletons, 300);
  }

  if (targetId === 'mobile') {
    // Cerrar el menú hamburguesa si estaba abierto
    const phoneMenu = document.getElementById('phone-menu');
    if (phoneMenu) phoneMenu.classList.add('hidden');
  }

  // Scroll al top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── NAVEGACIÓN CON TECLADO ───────────────────────────────────

/**
 * Permite navegar entre secciones con las teclas ← y →
 */
document.addEventListener('keydown', function (e) {
  const currentIndex = SECTION_IDS.findIndex(id => {
    const el = document.getElementById(id);
    return el && !el.classList.contains('hidden');
  });

  let nextIndex = currentIndex;

  if (e.key === 'ArrowRight' && currentIndex < SECTION_IDS.length - 1) {
    nextIndex = currentIndex + 1;
  } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
    nextIndex = currentIndex - 1;
  } else {
    return;
  }

  const buttons = document.querySelectorAll('.nav-btn');
  showSection(SECTION_IDS[nextIndex], buttons[nextIndex] || null);
});

// ─── WEB 1.0 — INTERACCIONES ─────────────────────────────────
// (La sección Web 1.0 es principalmente estática + marquee nativo;
//  no requiere JS adicional salvo la navegación global)

// ─── WEB 2.0 — INTERACCIONES ─────────────────────────────────

/**
 * Simula el "me gusta" en un post del blog.
 * @param {HTMLElement} btn — botón clickeado
 */
function likePost(btn) {
  const countEl = btn.querySelector('.web20-count');
  if (!countEl) return;

  const isLiked = btn.classList.contains('liked');
  const count = parseInt(countEl.textContent, 10);

  if (isLiked) {
    countEl.textContent = count - 1;
    btn.classList.remove('liked');
    btn.style.background = '';
  } else {
    countEl.textContent = count + 1;
    btn.classList.add('liked');
    btn.style.background = 'linear-gradient(180deg, #ffaa44 0%, #ff8800 50%, #cc6600 51%, #ffaa44 100%)';
  }
}

/**
 * Simula el envío de un comentario en el blog.
 * @param {HTMLElement} btn — botón de submit
 */
function submitComment(btn) {
  const form = btn.closest('.web20-comment-form');
  if (!form) return;

  const nameInput = form.querySelector('input[placeholder="Tu nombre"]');
  const commentArea = form.querySelector('.web20-textarea');

  const name = nameInput ? nameInput.value.trim() : '';
  const text = commentArea ? commentArea.value.trim() : '';

  if (!name || !text) {
    // Feedback visual de error
    if (!name && nameInput) {
      nameInput.style.borderColor = '#cc2200';
      nameInput.placeholder = '⚠ Campo requerido';
      setTimeout(() => {
        nameInput.style.borderColor = '';
        nameInput.placeholder = 'Tu nombre';
      }, 2000);
    }
    if (!text && commentArea) {
      commentArea.style.borderColor = '#cc2200';
      commentArea.placeholder = '⚠ Escribí tu comentario primero!';
      setTimeout(() => {
        commentArea.style.borderColor = '';
        commentArea.placeholder = 'Escribí tu comentario acá...';
      }, 2000);
    }
    return;
  }

  // Crear elemento de comentario
  const commentsContainer = document.getElementById('web20-comments');
  const commentsList = commentsContainer.querySelectorAll('.web20-comment');
  const lastComment = commentsList[commentsList.length - 1];

  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2,'0')}/${(now.getMonth()+1).toString().padStart(2,'0')}/${now.getFullYear()} a las ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  const newComment = document.createElement('div');
  newComment.className = 'web20-comment';
  newComment.style.animation = 'fadeIn 0.3s ease';
  newComment.innerHTML = `
    <div class="web20-comment-avatar">${initials}</div>
    <div class="web20-comment-body">
      <div class="web20-comment-meta">
        <strong>${escapeHTML(name)}</strong> — ${dateStr}
      </div>
      <p>${escapeHTML(text)}</p>
      <a href="#" class="web20-link20 web20-comment-reply">↳ Responder</a>
    </div>
  `;

  // Insertar antes del form de comentario
  commentsContainer.insertBefore(newComment, form);

  // Actualizar contador de comentarios
  const title = commentsContainer.querySelector('.web20-comments-title');
  if (title) {
    const currentCount = commentsContainer.querySelectorAll('.web20-comment').length;
    title.textContent = `💬 Comentarios (${currentCount})`;
  }

  // Limpiar formulario
  if (nameInput) nameInput.value = '';
  if (commentArea) commentArea.value = '';

  // Feedback de éxito
  const origText = btn.textContent;
  btn.textContent = '✔ ¡Comentario publicado!';
  btn.style.background = 'linear-gradient(180deg, #88cc55 0%, #55aa22 50%, #448811 51%, #66bb33 100%)';
  setTimeout(() => {
    btn.textContent = origText;
    btn.style.background = '';
  }, 2500);
}

// ─── ERA MOBILE — INTERACCIONES ───────────────────────────────

/**
 * Abre/cierra el menú hamburguesa del smartphone mockup.
 */
function toggleMobileMenu() {
  const menu = document.getElementById('phone-menu');
  if (!menu) return;
  menu.classList.toggle('hidden');
}

/**
 * Simula el "like" en un post del feed del smartphone.
 * @param {HTMLElement} btn — botón de like clickeado
 */
function likePhonePost(btn) {
  const isLiked = btn.dataset.liked === 'true';
  const text = btn.textContent;

  // Extraer número del texto (e.g. "🤍 124" → 124)
  const match = text.match(/(\d+)/);
  if (!match) return;

  const count = parseInt(match[1], 10);

  if (isLiked) {
    btn.textContent = `🤍 ${count - 1}`;
    btn.dataset.liked = 'false';
    btn.style.color = '';
  } else {
    btn.textContent = `❤ ${count + 1}`;
    btn.dataset.liked = 'true';
    btn.style.color = '#e1306c';
  }

  // Micro-animación
  btn.style.transform = 'scale(1.3)';
  setTimeout(() => { btn.style.transform = ''; }, 200);
}

// ─── WEB MODERNA — SKELETON LOADERS ───────────────────────────

let _skeletonTimeout = null;

/**
 * Simula una llamada a API con skeleton loaders.
 * Reemplaza las cards con skeletons, luego las restaura con fade-in.
 */
function triggerSkeletons() {
  const grid = document.getElementById('modern-cards-grid');
  if (!grid) return;

  // Evitar ejecuciones solapadas
  if (_skeletonTimeout) clearTimeout(_skeletonTimeout);

  // Guardar HTML original
  const originalHTML = grid.innerHTML;

  // Mostrar skeletons
  grid.innerHTML = Array.from({ length: 6 }, buildSkeletonCard).join('');

  // Restaurar cards con animación escalonada
  _skeletonTimeout = setTimeout(() => {
    grid.innerHTML = originalHTML;

    // Aplicar animación de entrada escalonada a cada card
    const cards = grid.querySelectorAll('.modern-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.animationDelay = `${i * 80}ms`;

      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  }, 1800);
}

/**
 * Genera el HTML de una skeleton card.
 * @returns {string} HTML string
 */
function buildSkeletonCard() {
  return `
    <div class="skeleton-card">
      <div class="skeleton-line" style="width:40px;height:32px;border-radius:8px"></div>
      <div class="skeleton-line" style="width:65%;height:16px"></div>
      <div class="skeleton-line" style="width:100%;height:11px"></div>
      <div class="skeleton-line" style="width:88%;height:11px"></div>
      <div class="skeleton-line" style="width:75%;height:11px"></div>
      <div style="display:flex;gap:6px;margin-top:4px">
        <div class="skeleton-line" style="width:70px;height:20px;border-radius:4px"></div>
        <div class="skeleton-line" style="width:55px;height:20px;border-radius:4px"></div>
        <div class="skeleton-line" style="width:60px;height:20px;border-radius:4px"></div>
      </div>
    </div>
  `;
}

// ─── UTILIDADES ───────────────────────────────────────────────

/**
 * Escapa caracteres HTML para prevenir XSS al insertar contenido dinámico.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

// ─── INICIALIZACIÓN ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

  // Asegurarse de que Web 1.0 sea la sección inicial
  SECTION_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const web10 = document.getElementById('web10');
  if (web10) web10.classList.remove('hidden');

  const firstBtn = document.querySelector('.nav-btn');
  if (firstBtn) firstBtn.classList.add('active');

  // Instrucción de teclado en consola
  console.log(
    '%c🌐 Evolución de la Arquitectura Web',
    'color:#6366f1;font-size:18px;font-weight:900;'
  );
  console.log(
    '%c← → Usá las flechas del teclado para navegar entre épocas.',
    'color:#a0a0c0;font-size:13px;'
  );
  console.log(
    '%cSecciones: Web 1.0 | Web 2.0 | Mobile | Moderna',
    'color:#5555aa;font-size:12px;'
  );

});
