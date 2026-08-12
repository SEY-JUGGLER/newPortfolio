(function () {
  'use strict';

  // ─── Theme Toggle ───
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle.querySelector('i');

  function setTheme(isLight) {
    document.body.classList.toggle('light-mode', isLight);
    themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') setTheme(true);

  themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('light-mode'));
  });

  // ─── Mobile Menu ───
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.innerHTML = navLinks.classList.contains('open')
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // ─── Smooth Scroll & Active Nav Link ───
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  navLinkEls.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        navLinks.classList.remove('open');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);

  // ─── Typing Effect ───
  const typingText = document.querySelector('.typing-text');
  if (typingText) {
    const words = [
      'Développeur Web',
      'UI/UX Designer',
      'Freelance',
      'Passionné du Web'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
      const currentWord = words[wordIndex];

      if (isPaused) {
        setTimeout(type, 2000);
        isPaused = false;
        return;
      }

      if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isPaused = true;
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }

      const speed = isDeleting ? 40 : 80;
      setTimeout(type, speed);
    }

    type();
  }

  // ─── Scroll Reveal (Intersection Observer) ───
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Skill Bars Animation ───
  const skillBars = document.querySelectorAll('.skill-progress');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.progress + '%';
          skillObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ─── Counter Animation ───
  const counters = document.querySelectorAll('.hero-stat-number');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          animateCounter(counter, target);
          counterObserver.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current;
    }, 40);
  }

  // ─── Contact Form (EmailJS) ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('.btn-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>Envoi en cours...</span><i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      const formData = new FormData(this);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };

      if (typeof emailjs !== 'undefined') {
        emailjs.send('service_zpe8zbr', 'template_bzkl4hy', data, )
          .then(() => {
            showFormMessage('Message envoyé avec succès !', 'success');
            contactForm.reset();
          })
          .catch(() => {
            showFormMessage('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
          })
          .finally(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
          });
      } else {
        setTimeout(() => {
          showFormMessage('Merci pour votre message ! Je vous répondrai rapidement.', 'success');
          contactForm.reset();
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 1000);
      }
    });
  }

  function showFormMessage(text, type) {
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = 'form-message';
    msg.textContent = text;
    msg.style.cssText = `
      padding: 1rem;
      border-radius: var(--radius-sm);
      margin-top: 1rem;
      font-size: 0.9rem;
      font-weight: 500;
      background: ${type === 'success' ? 'rgba(0, 184, 148, 0.15)' : 'rgba(253, 121, 168, 0.15)'};
      border: 1px solid ${type === 'success' ? 'rgba(0, 184, 148, 0.3)' : 'rgba(253, 121, 168, 0.3)'};
      color: ${type === 'success' ? 'var(--color-text)' : 'var(--color-text)'};
      animation: fadeIn 0.3s ease;
    `;

    contactForm.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
  }

  // ─── Parallax effect on hero orbs ───
  document.addEventListener('mousemove', e => {
    const orbs = document.querySelectorAll('.gradient-orb');
    if (orbs.length === 0) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 5;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

})();
