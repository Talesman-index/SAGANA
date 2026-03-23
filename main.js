import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navIconSpans = navToggle ? navToggle.querySelectorAll('span') : [];
  
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
          mobileMenu.classList.remove('opacity-0');
          mobileMenu.classList.add('opacity-100');
        }, 10);
        navIconSpans.forEach(span => span.classList.add('is-active'));
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('opacity-100');
        mobileMenu.classList.add('opacity-0');
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 500);
        navIconSpans.forEach(span => span.classList.remove('is-active'));
        document.body.style.overflow = '';
      }
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.click();
      });
    });
  }

  // --- Scroll Reveal Animation ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1, 
    rootMargin: '0px 0px -40px 0px' 
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // --- Smooth Scroll fixed for offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Parallax Image Logic ---
  const parallaxImg = document.querySelector('.parallax-img');
  if (parallaxImg) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        parallaxImg.style.transform = `translate3d(0, ${scrolled * 0.1}px, 0) scale(1.15)`;
    }, { passive: true });
  }

  // --- Blog Slider Logic ---
  const slider = document.getElementById('blogSlider');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  
  if (slider && prevBtn && nextBtn) {
    const scrollAmount = 500;
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // --- Number Counters ---
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const duration = 2500;
          const increment = target / (duration / 16);
          
          const updateCount = () => {
            count += increment;
            if (count < target) {
              counter.innerText = Math.ceil(count) + (target > 90 ? "%" : "+");
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target + (target > 90 ? "%" : "+");
            }
          };
          updateCount();
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  const metricsSection = document.getElementById('metrics');
  if (metricsSection) counterObserver.observe(metricsSection);

  // --- Form specific logic ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const originalText = btn.innerText;
      
      btn.disabled = true;
      btn.innerText = "Envoi...";
      
      setTimeout(() => {
        contactForm.reset();
        document.getElementById('formSuccess').classList.remove('hidden');
        btn.style.display = 'none';
        btn.innerText = "Envoyé avec succès";
      }, 1500);
    });
  }
  // --- Rotating Process Wheel Logic ---
  const processSection = document.getElementById('process');
  const processHeader = document.getElementById('processHeader');
  const processWheel = document.getElementById('processWheel');
  const stepContent = document.getElementById('stepContent');
  const stepNumberDisplay = document.getElementById('stepNumberDisplay');
  const stepTitleDisplay = document.getElementById('stepTitleDisplay');
  const stepDescriptionDisplay = document.getElementById('stepDescriptionDisplay');

  const steps = [
    {
      label: "ÉTAPE 01",
      number: "1",
      title: "Découverte & Audit",
      description: "Nous commençons par comprendre exactement comment votre équipe travaille aujourd'hui pour identifier les leviers de croissance critiques."
    },
    {
      label: "ÉTAPE 02",
      number: "2",
      title: "Conception & Construction",
      description: "Notre équipe conçoit des solutions sur mesure, adaptées à vos processus, puis les construit et les teste rigoureusement."
    },
    {
      label: "ÉTAPE 03",
      number: "3",
      title: "Déploiement & Optimisation",
      description: "Nous déployons vos systèmes, surveillons les performances et les affinons pour garantir un ROI maximal et durable."
    }
  ];

  let currentStepIndex = -1;

  const processGlow = document.getElementById('processGlow');
  const wheelMarkers = document.querySelectorAll('.wheel-marker');
  
  if (processSection && processWheel && stepContent) {
    const stepLabelDisplay = document.getElementById('stepLabelDisplay');

    window.addEventListener('scroll', () => {
      const sectionRect = processSection.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      const windowHeight = window.innerHeight;

      // Calculate progress (0 to 1) based on sticky scroll
      let progress = -sectionTop / (sectionHeight - windowHeight);
      progress = Math.max(0, Math.min(1, progress));

      // Active glow
      if (processGlow) {
        if (progress > 0.1 && progress < 0.9) {
          processGlow.classList.add('is-active');
        } else {
          processGlow.classList.remove('is-active');
        }
      }

      // Fade out main header faster to avoid overlap
      if (processHeader) {
        if (progress > 0.05) {
          const headerOpacity = Math.max(0, 1 - (progress - 0.05) * 8);
          processHeader.style.opacity = headerOpacity;
          processHeader.style.transform = `translateY(${(progress - 0.05) * -100}px)`;
          processHeader.style.pointerEvents = headerOpacity < 0.1 ? 'none' : 'auto';
        } else {
          processHeader.style.opacity = '1';
          processHeader.style.transform = 'translateY(0)';
          processHeader.style.pointerEvents = 'auto';
        }
      }

      // Rotate wheel
      const rotation = (progress * 60) - 30; // Slightly tighter rotation
      processWheel.style.transform = `rotate(${-rotation}deg)`;

      // Determine active step
      let stepIndex = Math.floor(progress * steps.length);
      if (stepIndex >= steps.length) stepIndex = steps.length - 1;

      // Update markers
      wheelMarkers.forEach((marker, idx) => {
        if (idx === stepIndex && progress > 0.1 && progress < 0.9) {
          marker.classList.add('active');
        } else {
          marker.classList.remove('active');
        }
      });

      if (stepIndex !== currentStepIndex) {
        currentStepIndex = stepIndex;
        const step = steps[stepIndex];

        // Fade out current content
        stepContent.classList.add('is-changing');
        
        setTimeout(() => {
          if (stepLabelDisplay) stepLabelDisplay.innerText = step.label;
          if (stepNumberDisplay) stepNumberDisplay.innerText = step.number;
          if (stepTitleDisplay) stepTitleDisplay.innerText = step.title;
          if (stepDescriptionDisplay) stepDescriptionDisplay.innerText = step.description;
          
          stepContent.classList.remove('is-changing');
          
          // Only fade in if we are in the active range
          if (progress > 0.1 && progress < 0.95) {
            stepContent.style.opacity = '1';
          }
        }, 350);
      }
      
      // Control step content visibility range
      if (progress > 0.15 && progress < 0.95) {
        if (!stepContent.classList.contains('is-changing')) {
            stepContent.style.opacity = '1';
            stepContent.style.transform = 'translateY(0)';
        }
      } else if (progress <= 0.15) {
          stepContent.style.opacity = '0';
          stepContent.style.transform = 'translateY(20px)';
      }
      
    }, { passive: true });
  }

  // Footer Clock
  const footerClock = document.getElementById('footerClock');
  if (footerClock) {
    function updateClock() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
      footerClock.innerText = timeString + " PARIS TIME";
    }
    updateClock();
    setInterval(updateClock, 1000);
  }
});
