/* ═══════════════════════════════════
   ZEUS AUTOMOTRIZ — script.js
═══════════════════════════════════ */

const WA = '523221179633';

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── MOBILE NAV TOGGLE ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── HERO PARTICLES ── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const isYellow = Math.random() > 0.6;
    Object.assign(p.style, {
      position: 'absolute',
      width:  size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: isYellow ? 'rgba(255,215,0,0.7)' : 'rgba(150,200,255,0.5)',
      left: Math.random() * 100 + '%',
      top:  Math.random() * 100 + '%',
      animation: `floatPart ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite`,
      boxShadow: isYellow ? '0 0 8px rgba(255,215,0,0.5)' : '0 0 8px rgba(100,180,255,0.4)',
    });
    container.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatPart {
      0%,100%{ transform: translateY(0) scale(1); opacity: 0.6; }
      50%    { transform: translateY(-30px) scale(1.2); opacity: 1; }
    }`;
  document.head.appendChild(style);
})();

/* ── STATS COUNTER ── */
function animateCount(el) {
  const target = +el.dataset.count;
  const duration = 1800;
  const start = performance.now();
  (function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  })(start);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCount);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stats-bar').forEach(el => statsObserver.observe(el));

/* ── REVEAL ON SCROLL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), +delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

/* ── PIEZAS CATEGORY FILTER ── */
document.querySelectorAll('.pieza-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    document.querySelectorAll('.pieza-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.pieza-item').forEach(item => {
      item.classList.toggle('active', item.dataset.cat === cat);
    });
  });
});

/* ── CHATBOT ── */
const chatToggle  = document.getElementById('chatToggle');
const chatWindow  = document.getElementById('chatbotWindow');
const chatMinimize= document.getElementById('chatMinimize');
const chatMessages= document.getElementById('chatMessages');
const quickReplies= document.getElementById('quickReplies');
const chatInput   = document.getElementById('chatInput');
const chatSend    = document.getElementById('chatSend');
const chatNotif   = document.querySelector('.chat-notif');

const BOT_RESPONSES = {
  'servicios':    '⚡ Ofrecemos diagnóstico computarizado, mantenimiento preventivo, reparación de motor, frenos, sistema eléctrico y afinación. ¿En cuál estás interesado?',
  'precio':       '💬 Los precios varían según el servicio. Escríbenos por WhatsApp para una cotización sin compromiso al +52 322 117 9633.',
  'horario':      '🕐 Atendemos Lunes a Viernes de 8 AM a 6 PM y Sábado de 8 AM a 2 PM.',
  'piezas':       '🔧 Tenemos más de 4,000 piezas en stock: motor, suspensión, frenos, eléctrico y transmisión. ¿Qué pieza necesitas?',
  'cita':         '📅 Puedes agendar haciendo clic en el botón "Agendar" de cualquier servicio, o directamente por WhatsApp.',
  'whatsapp':     '📱 Nuestro número es +52 322 117 9633. ¡Te respondemos en menos de 1 hora!',
  'ubicacion':    '📍 Visítanos en nuestro taller. Puedes encontrarnos en Google Maps buscando "Zeus Automotriz".',
  'default':      '⚡ ¡Hola! Soy el asistente de Zeus Automotriz. Puedo ayudarte con información sobre servicios, precios, horarios o piezas. ¿En qué te puedo ayudar?'
};

const QUICK = ['Servicios', 'Horario', 'Piezas', 'Agendar cita', 'WhatsApp'];

let chatOpen = false;

function addMsg(text, type) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  if (type === 'bot') {
    msg.innerHTML = `<div class="msg-avatar">⚡</div><div class="msg-bubble">${text}</div>`;
  } else {
    msg.innerHTML = `<div class="msg-bubble">${text}</div>`;
  }
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const t = document.createElement('div');
  t.className = 'chat-msg bot msg-typing';
  t.id = 'typingIndicator';
  t.innerHTML = `<div class="msg-avatar">⚡</div><div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
  chatMessages.appendChild(t);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function hideTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

function botReply(input) {
  const lower = input.toLowerCase();
  let response = BOT_RESPONSES.default;
  if (lower.includes('servicio') || lower.includes('servic')) response = BOT_RESPONSES.servicios;
  else if (lower.includes('precio') || lower.includes('costo') || lower.includes('cuanto')) response = BOT_RESPONSES.precio;
  else if (lower.includes('horario') || lower.includes('hora') || lower.includes('abren')) response = BOT_RESPONSES.horario;
  else if (lower.includes('pieza') || lower.includes('refacc') || lower.includes('parte')) response = BOT_RESPONSES.piezas;
  else if (lower.includes('cita') || lower.includes('agendar') || lower.includes('agenda')) response = BOT_RESPONSES.cita;
  else if (lower.includes('whatsapp') || lower.includes('telefono') || lower.includes('número') || lower.includes('numero')) response = BOT_RESPONSES.whatsapp;
  else if (lower.includes('ubicac') || lower.includes('direcci') || lower.includes('donde')) response = BOT_RESPONSES.ubicacion;

  showTyping();
  setTimeout(() => {
    hideTyping();
    addMsg(response, 'bot');
    renderQuickReplies();
  }, 900);
}

function renderQuickReplies() {
  quickReplies.innerHTML = '';
  QUICK.forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'quick-reply';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      addMsg(label, 'user');
      quickReplies.innerHTML = '';
      botReply(label);
    });
    quickReplies.appendChild(btn);
  });
}

chatToggle.addEventListener('click', () => {
  chatOpen = !chatOpen;
  chatToggle.classList.toggle('open', chatOpen);
  chatWindow.classList.toggle('open', chatOpen);
  if (chatOpen) {
    chatNotif.classList.add('hidden');
    if (chatMessages.children.length === 0) {
      setTimeout(() => {
        addMsg('¡Bienvenido a <strong>Zeus Automotriz</strong>! ⚡ ¿En qué puedo ayudarte hoy?', 'bot');
        renderQuickReplies();
      }, 300);
    }
  }
});

chatMinimize.addEventListener('click', () => {
  chatOpen = false;
  chatToggle.classList.remove('open');
  chatWindow.classList.remove('open');
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addMsg(text, 'user');
  chatInput.value = '';
  quickReplies.innerHTML = '';
  botReply(text);
}
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

/* ── CONTACT FORM → WHATSAPP ── */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nombre   = this.querySelector('input[type="text"]').value;
  const telefono = this.querySelector('input[type="tel"]').value;
  const vehiculo = this.querySelectorAll('select')[0].value;
  const servicio = this.querySelectorAll('select')[1].value;
  const mensaje  = this.querySelector('textarea').value;
  const text = `Hola Zeus Automotriz!%0A%0A*Nombre:* ${encodeURIComponent(nombre)}%0A*Teléfono:* ${encodeURIComponent(telefono)}%0A*Vehículo:* ${encodeURIComponent(vehiculo)}%0A*Servicio:* ${encodeURIComponent(servicio)}%0A*Mensaje:* ${encodeURIComponent(mensaje)}`;
  window.open(`https://wa.me/${WA}?text=${text}`, '_blank');
});

/* ═══════════════════════════════════
   MODAL DE AGENDA
═══════════════════════════════════ */
const overlay   = document.getElementById('agendaOverlay');
const closeBtn  = document.getElementById('agendaClose');
let currentStep = 1;
let selectedServicio = '';
let selectedDate = null;
let selectedTime = '';
let calDate = new Date();

function abrirAgenda(servicio) {
  selectedServicio = servicio || '';
  currentStep = selectedServicio ? 2 : 1;
  renderStep();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (selectedServicio) {
    setTimeout(() => {
      document.querySelectorAll('.servicio-opt').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.servicio === selectedServicio);
      });
    }, 50);
  }
}
window.abrirAgenda = abrirAgenda;

closeBtn.addEventListener('click', cerrarAgenda);
overlay.addEventListener('click', e => { if (e.target === overlay) cerrarAgenda(); });
function cerrarAgenda() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(resetAgenda, 350);
}
function resetAgenda() {
  currentStep = 1; selectedServicio = ''; selectedDate = null; selectedTime = '';
  renderStep();
}

function renderStep() {
  [1,2,3,4].forEach(i => {
    document.getElementById(`step${i}`).classList.toggle('hidden', i !== currentStep);
  });
  document.querySelectorAll('.agenda-step').forEach(el => {
    const s = +el.dataset.step;
    el.classList.toggle('active', s === currentStep);
    el.classList.toggle('done', s < currentStep);
  });
  if (currentStep === 2) renderCalendar();
  if (currentStep === 3) renderTimeSlots();
  if (currentStep === 4) renderSummary();
}

/* Step 1 */
document.querySelectorAll('.servicio-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.servicio-opt').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedServicio = btn.dataset.servicio;
    document.getElementById('step1Next').disabled = false;
  });
});
document.getElementById('step1Next').addEventListener('click', () => {
  if (!selectedServicio) return;
  currentStep = 2; renderStep();
});

/* Calendar */
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function renderCalendar() {
  const now = new Date();
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById('calMonthLabel').textContent = `${MONTHS[m]} ${y}`;
  const firstDay = new Date(y, m, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const container = document.getElementById('calDays');
  container.innerHTML = '';
  for (let i = 0; i < offset; i++) {
    const d = document.createElement('div'); d.className = 'cal-day empty'; container.appendChild(d);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = document.createElement('div');
    const date = new Date(y, m, day);
    const isToday = date.toDateString() === now.toDateString();
    const isPast  = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isSun   = date.getDay() === 0;
    d.className = 'cal-day' + (isToday ? ' today' : '') + (isPast || isSun ? ' disabled past' : '');
    d.textContent = day;
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) d.classList.add('selected');
    if (!isPast && !isSun) {
      d.addEventListener('click', () => {
        selectedDate = date;
        document.getElementById('step2Next').disabled = false;
        renderCalendar();
      });
    }
    container.appendChild(d);
  }
}

document.getElementById('calPrev').addEventListener('click', () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); });
document.getElementById('calNext').addEventListener('click', () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); });

document.getElementById('step2Back').addEventListener('click', () => { currentStep = 1; renderStep(); });
document.getElementById('step2Next').addEventListener('click', () => {
  if (!selectedDate) return;
  currentStep = 3; renderStep();
});

/* Time Slots */
const TIMES = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

function renderTimeSlots() {
  const label = selectedDate.toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long' });
  document.getElementById('stepDateLabel').textContent = label;
  const container = document.getElementById('timeSlots');
  container.innerHTML = '';
  TIMES.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'time-slot' + (t === selectedTime ? ' selected' : '');
    btn.textContent = t;
    btn.addEventListener('click', () => {
      selectedTime = t;
      document.getElementById('step3Next').disabled = false;
      container.querySelectorAll('.time-slot').forEach(b => b.classList.toggle('selected', b.textContent === t));
    });
    container.appendChild(btn);
  });
}

document.getElementById('step3Back').addEventListener('click', () => { currentStep = 2; renderStep(); });
document.getElementById('step3Next').addEventListener('click', () => {
  if (!selectedTime) return;
  currentStep = 4; renderStep();
});

/* Summary */
function renderSummary() {
  const dateStr = selectedDate.toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  document.getElementById('agendaSummary').innerHTML = `
    <div class="sum-row"><span class="sum-label">Servicio</span><span class="sum-value">${selectedServicio}</span></div>
    <div class="sum-row"><span class="sum-label">Fecha</span><span class="sum-value" style="text-transform:capitalize">${dateStr}</span></div>
    <div class="sum-row"><span class="sum-label">Hora</span><span class="sum-value">${selectedTime}</span></div>`;
}

document.getElementById('step4Back').addEventListener('click', () => { currentStep = 3; renderStep(); });

document.getElementById('btnConfirmarWA').addEventListener('click', () => {
  const nombre   = document.getElementById('agendaNombre').value.trim() || 'Sin nombre';
  const telefono = document.getElementById('agendaTelefono').value.trim() || 'Sin teléfono';
  const notas    = document.getElementById('agendaNotas').value.trim();
  const dateStr  = selectedDate.toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const text = `Hola Zeus Automotriz!%0A%0AQuiero agendar una cita:%0A%0A*Servicio:* ${encodeURIComponent(selectedServicio)}%0A*Fecha:* ${encodeURIComponent(dateStr)}%0A*Hora:* ${encodeURIComponent(selectedTime)}%0A*Nombre:* ${encodeURIComponent(nombre)}%0A*Teléfono:* ${encodeURIComponent(telefono)}${notas ? '%0A*Notas:* ' + encodeURIComponent(notas) : ''}`;
  window.open(`https://wa.me/${WA}?text=${text}`, '_blank');
  cerrarAgenda();
});

document.getElementById('btnGcal').addEventListener('click', () => {
  if (!selectedDate || !selectedTime) return;
  const [h, min] = selectedTime.split(':').map(Number);
  const start = new Date(selectedDate);
  start.setHours(h, min, 0);
  const end = new Date(start.getTime() + 60 * 60000);
  const fmt = d => d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Cita Zeus Automotriz – ' + selectedServicio)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent('Cita agendada con Zeus Automotriz\nServicio: ' + selectedServicio)}&location=${encodeURIComponent('Zeus Automotriz')}`;
  window.open(url, '_blank');
});

/* ── KEYBOARD ESCAPE ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (overlay.classList.contains('open')) cerrarAgenda();
    if (chatOpen) { chatOpen = false; chatToggle.classList.remove('open'); chatWindow.classList.remove('open'); }
  }
});
