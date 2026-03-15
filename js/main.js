/* ============================================================
   Houston Flood Safety Guide — main.js
   Pure vanilla JS, no build tools
   ============================================================ */

(function () {
  'use strict';

  // ─── Rain Canvas ──────────────────────────────────────
  const canvas = document.getElementById('rainCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drops = [];
    let W, H;

    function resizeCanvas() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function initDrops() {
      drops = [];
      const count = Math.floor(W * 0.15);
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * W,
          y: Math.random() * H,
          len: Math.random() * 18 + 8,
          speed: Math.random() * 4 + 3,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
    }
    initDrops();

    function animateRain() {
      ctx.clearRect(0, 0, W, H);
      for (const d of drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 1, d.y + d.len);
        ctx.strokeStyle = `rgba(0, 212, 180, ${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        d.y += d.speed;
        if (d.y > H) {
          d.y = -d.len;
          d.x = Math.random() * W;
        }
      }
      requestAnimationFrame(animateRain);
    }
    animateRain();
  }

  // ─── Mobile Nav ───────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', open);
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ─── Active nav link on scroll ────────────────────────
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(function (sec) {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // ─── AOS (scroll animations) ─────────────────────────
  function initAOS() {
    const els = document.querySelectorAll('[data-aos]');
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-aos-delay');
            if (delay) {
              setTimeout(function () {
                entry.target.classList.add('aos-animate');
              }, parseInt(delay));
            } else {
              entry.target.classList.add('aos-animate');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach(function (el) { observer.observe(el); });
  }
  initAOS();

  // ─── Checklist with localStorage ──────────────────────
  const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
  const progressFill = document.getElementById('checklistProgress');
  const progressText = document.getElementById('checklistText');

  function loadChecklist() {
    checkboxes.forEach(function (cb) {
      const key = cb.getAttribute('data-key');
      if (key && localStorage.getItem('flood_' + key) === 'true') {
        cb.checked = true;
      }
    });
    updateProgress();
  }

  function updateProgress() {
    const total = checkboxes.length;
    let checked = 0;
    checkboxes.forEach(function (cb) { if (cb.checked) checked++; });
    const pct = total ? (checked / total) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressText) progressText.textContent = checked + ' / ' + total + ' completed';
  }

  checkboxes.forEach(function (cb) {
    cb.addEventListener('change', function () {
      const key = cb.getAttribute('data-key');
      if (key) localStorage.setItem('flood_' + key, cb.checked);
      updateProgress();
    });
  });
  loadChecklist();

  // ─── Animated Counters ────────────────────────────────
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            let current = 0;
            const duration = 1500;
            const step = target / (duration / 16);
            function count() {
              current += step;
              if (current >= target) {
                el.textContent = target;
              } else {
                el.textContent = Math.floor(current);
                requestAnimationFrame(count);
              }
            }
            count();
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) { observer.observe(c); });
  }
  animateCounters();

  // ─── Chart.js — Flood Kit Breakdown ───────────────────
  const kitChartEl = document.getElementById('kitChart');
  if (kitChartEl && typeof Chart !== 'undefined') {
    new Chart(kitChartEl, {
      type: 'doughnut',
      data: {
        labels: ['Food & Water', 'First Aid', 'Communication', 'Documents', 'Disability', 'Pet Supplies', 'Shelter Extras', 'Car Kit'],
        datasets: [{
          data: [3, 4, 3, 3, 4, 4, 3, 4],
          backgroundColor: [
            '#00D4B4', '#FF8C00', '#3B82F6', '#8B5CF6',
            '#EC4899', '#F59E0B', '#10B981', '#6366F1'
          ],
          borderColor: '#0A1628',
          borderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94A3B8', font: { family: 'Inter', size: 13 }, padding: 16 },
          },
        },
      },
    });
  }

  // ─── Leaflet Map ──────────────────────────────────────
  const mapEl = document.getElementById('floodMap');
  if (mapEl && typeof L !== 'undefined') {
    const map = L.map('floodMap', {
      center: [29.7604, -95.3698],
      zoom: 10,
      scrollWheelZoom: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 18,
    }).addTo(map);

    // Highlight some flood-prone areas
    var floodZones = [
      { name: 'Buffalo Bayou', lat: 29.7604, lng: -95.3698 },
      { name: 'Brays Bayou', lat: 29.6850, lng: -95.4100 },
      { name: 'White Oak Bayou', lat: 29.7900, lng: -95.3900 },
      { name: 'Greens Bayou', lat: 29.8700, lng: -95.2600 },
      { name: 'Clear Creek', lat: 29.5800, lng: -95.1300 },
      { name: 'Addicks Reservoir', lat: 29.7800, lng: -95.6300 },
      { name: 'Barker Reservoir', lat: 29.7200, lng: -95.6800 },
      { name: 'San Jacinto River', lat: 29.8500, lng: -95.0800 },
    ];

    floodZones.forEach(function (z) {
      L.circle([z.lat, z.lng], {
        radius: 3000,
        color: '#00D4B4',
        fillColor: '#00D4B4',
        fillOpacity: 0.15,
        weight: 1,
      }).addTo(map).bindPopup('<strong>' + z.name + '</strong><br>Flood-prone area');
    });
  }

  // ─── Quiz ─────────────────────────────────────────────
  var quizData = [
    {
      q: 'How many inches of moving water can knock an adult off their feet?',
      options: ['2 inches', '6 inches', '12 inches', '24 inches'],
      answer: 1,
    },
    {
      q: 'Where should you go if you\'re sheltering in place during a flood?',
      options: ['The basement', 'The attic', 'An open, high place like the roof', 'Stay on the ground floor'],
      answer: 2,
    },
    {
      q: 'Does standard home or renter\'s insurance usually cover flood damage?',
      options: ['Yes, always', 'Only for renters', 'No, you need separate flood insurance', 'Only in Houston'],
      answer: 2,
    },
    {
      q: 'What should you do BEFORE removing debris after a flood?',
      options: ['Start cleaning immediately', 'Hire a flood adjuster and photograph damage', 'Wait 30 days', 'Call your neighbors'],
      answer: 1,
    },
    {
      q: 'How much water per person per day should you store in your flood kit?',
      options: ['1 cup', '1 liter', '1 gallon', '5 gallons'],
      answer: 2,
    },
  ];

  var quizContent = document.getElementById('quizContent');
  var quizScoreEl = document.getElementById('quizScore');
  var answered = 0;
  var score = 0;

  function renderQuiz() {
    var html = '';
    quizData.forEach(function (item, qi) {
      html += '<div class="quiz-question" id="q' + qi + '">';
      html += '<h3><span class="q-num">Q' + (qi + 1) + '.</span> ' + item.q + '</h3>';
      html += '<div class="quiz-options">';
      item.options.forEach(function (opt, oi) {
        html += '<button class="quiz-option" data-q="' + qi + '" data-o="' + oi + '">' + opt + '</button>';
      });
      html += '</div>';
      html += '<div class="quiz-feedback" id="fb' + qi + '"></div>';
      html += '</div>';
    });
    if (quizContent) quizContent.innerHTML = html;

    // Attach listeners
    document.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var qi = parseInt(btn.getAttribute('data-q'));
        var oi = parseInt(btn.getAttribute('data-o'));
        handleAnswer(qi, oi);
      });
    });
  }

  function handleAnswer(qi, oi) {
    var questionEl = document.getElementById('q' + qi);
    var fbEl = document.getElementById('fb' + qi);
    var buttons = questionEl.querySelectorAll('.quiz-option');

    // Prevent re-answer
    if (questionEl.classList.contains('answered')) return;
    questionEl.classList.add('answered');

    buttons.forEach(function (b) { b.classList.add('disabled'); });

    var correct = quizData[qi].answer;
    if (oi === correct) {
      buttons[oi].classList.add('correct');
      fbEl.textContent = 'Correct!';
      fbEl.className = 'quiz-feedback correct';
      score++;
    } else {
      buttons[oi].classList.add('incorrect');
      buttons[correct].classList.add('correct');
      fbEl.textContent = 'Incorrect — the right answer is: ' + quizData[qi].options[correct];
      fbEl.className = 'quiz-feedback incorrect';
    }
    answered++;

    if (answered === quizData.length) {
      setTimeout(showScore, 600);
    }
  }

  function showScore() {
    if (quizScoreEl) {
      quizScoreEl.classList.remove('hidden');
      var pct = Math.round((score / quizData.length) * 100);
      var msg = pct === 100 ? 'Perfect score! You\'re flood-ready!' :
                pct >= 60 ? 'Good job! Review the sections you missed.' :
                'Keep learning! Re-read the guide and try again.';
      quizScoreEl.innerHTML =
        '<div class="score-value">' + score + '/' + quizData.length + '</div>' +
        '<h3>Quiz Complete!</h3>' +
        '<p>' + msg + '</p>';
    }
  }

  renderQuiz();

  // ─── Emergency FAB ────────────────────────────────────
  var fabBtn = document.getElementById('fabBtn');
  var fabPanel = document.getElementById('fabPanel');
  if (fabBtn && fabPanel) {
    fabBtn.addEventListener('click', function () {
      var open = fabPanel.classList.toggle('open');
      fabBtn.setAttribute('aria-expanded', open);
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.emergency-fab')) {
        fabPanel.classList.remove('open');
        fabBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
