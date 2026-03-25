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

  // --- Navbar Color Switcher ---
  const navbar = document.getElementById('navbar');
  const navTriggerSections = document.querySelectorAll('section[data-nav-dark="true"]');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      let isDarkNav = false;
      const navbarRect = navbar.getBoundingClientRect();
      const navbarCenter = navbarRect.top + navbarRect.height / 2;

      navTriggerSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (navbarCenter >= rect.top && navbarCenter <= rect.bottom) {
          isDarkNav = true;
        }
      });

      if (isDarkNav) {
        navbar.classList.add('nav-is-dark');
      } else {
        navbar.classList.remove('nav-is-dark');
      }
    }, { passive: true });
  }

  // --- BI-DIRECTIONAL SCROLL-LOCKED PROCESS WHEEL ---
  const processSection = document.getElementById('process');
  const processHeader = document.getElementById('processHeader');
  const processWheel = document.getElementById('processWheel');
  const stepContent = document.getElementById('stepContent');
  const stepLabelDisplay = document.getElementById('stepLabelDisplay');
  const stepTitleDisplay = document.getElementById('stepTitleDisplay');
  const stepDescriptionDisplay = document.getElementById('stepDescriptionDisplay');
  const wheelMarkers = document.querySelectorAll('.wheel-marker');
  const progressBar = document.getElementById('processProgressBar');

  const steps = [
    { label: "PHASE 01", title: "Immersion & Audit", desc: "Nous forgeons une trajectoire précise en analysant vos leviers de croissance les plus profonds." },
    { label: "PHASE 02", title: "Build & Propulsion", desc: "Conception sur-mesure de solutions à haute performance, orchestrées avec une précision chirurgicale." },
    { label: "PHASE 03", title: "Impact & Évolution", desc: "Déploiement massif et optimisation continue pour garantir une dominance durable sur votre marché." }
  ];

  let currentStepIndex = -1;
  let lockProgress = 0; 
  let lerpProgress = 0;
  let isLocked = false;
  let isExiting = false;
  let touchStartY = 0;

  function updateProcessVisuals(prog) {
    if (processHeader) {
      const headerOpacity = Math.max(0, 1 - prog * 8);
      processHeader.style.opacity = headerOpacity;
      processHeader.style.pointerEvents = headerOpacity < 0.1 ? 'none' : 'auto';
    }

    const angle = -(prog * 240);
    if (processWheel) processWheel.style.transform = `rotate(${angle}deg)`;

    let stepIndex = 0;
    if (prog > 0.35 && prog <= 0.7) stepIndex = 1;
    else if (prog > 0.7) stepIndex = 2;

    if (stepIndex !== currentStepIndex) {
      currentStepIndex = stepIndex;
      const step = steps[stepIndex];
      
      stepContent.style.opacity = '0';
      setTimeout(() => {
        if (stepLabelDisplay) stepLabelDisplay.innerText = step.label;
        if (stepTitleDisplay) stepTitleDisplay.innerText = step.title;
        if (stepDescriptionDisplay) stepDescriptionDisplay.innerText = step.desc;
        stepContent.style.opacity = '1';
      }, 300);
    }

    wheelMarkers.forEach((marker, idx) => {
      if (idx === stepIndex) marker.classList.add('active');
      else marker.classList.remove('active');
    });

    if (progressBar) progressBar.style.width = `${prog * 100}%`;
  }

  // --- Smooth Lerp Animation Loop ---
  function animate() {
    if (!isLocked && !isExiting && Math.abs(lerpProgress - lockProgress) < 0.001) {
        requestAnimationFrame(animate);
        return;
    }

    // Smoothly interpolate lockProgress -> lerpProgress
    const ease = 0.12; // Adjust for "weight" feel (lower = heavier)
    lerpProgress += (lockProgress - lerpProgress) * ease;
    
    updateProcessVisuals(Math.max(0, Math.min(1, lerpProgress)));
    
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  function handleInteraction(delta) {
    if (!isLocked) return;
    
    const sensitivity = 0.0015; // Increased for more dynamism
    lockProgress = Math.max(-0.05, Math.min(1.05, lockProgress + delta * sensitivity));

    if (lockProgress >= 1.05 && delta > 0) {
        unlockProcess('down');
    } else if (lockProgress <= -0.05 && delta < 0) {
        unlockProcess('up');
    }
  }

  function unlockProcess(direction) {
    isLocked = false;
    isExiting = true;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    if (direction === 'down') {
        lockProgress = 1.05; // Set to end
        const nextTarget = document.getElementById('comparison');
        if (nextTarget) nextTarget.scrollIntoView({ behavior: 'smooth' });
    } else {
        lockProgress = -0.05; // Set to start
        const prevTarget = document.getElementById('expertises');
        if (prevTarget) prevTarget.scrollIntoView({ behavior: 'smooth' });
    }
    
    setTimeout(() => { isExiting = false; }, 800);
  }

  if (processSection) {
    window.addEventListener('wheel', (e) => {
      if (isExiting) return;

      const rect = processSection.getBoundingClientRect();
      const atTop = Math.abs(rect.top) < 30;

      // Enter from ABOVE (scrolling down)
      if (!isLocked && atTop && e.deltaY > 0 && lockProgress < 1) {
          isLocked = true;
          lockProgress = 0;
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          processSection.scrollIntoView({ behavior: 'auto' });
          updateProcessVisuals(0);
      }
      
      // Enter from BELOW (scrolling up)
      if (!isLocked && atTop && e.deltaY < 0 && lockProgress > 0) {
          isLocked = true;
          lockProgress = 1;
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          processSection.scrollIntoView({ behavior: 'auto' });
          updateProcessVisuals(1);
      }

      if (isLocked) {
        e.preventDefault();
        handleInteraction(e.deltaY);
      }
    }, { passive: false });

    // Touch Support
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    window.addEventListener('touchmove', (e) => {
        if (isExiting) return;
        
        const rect = processSection.getBoundingClientRect();
        const atTop = Math.abs(rect.top) < 30;

        if (isLocked) {
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const deltaY = (touchStartY - touchY) * 2;
            handleInteraction(deltaY);
            touchStartY = touchY;
            return;
        }

        // Detect entry (swipe up = scroll down)
        if (!isLocked && atTop) {
            const deltaY = touchStartY - e.touches[0].clientY;
            // From top going down
            if (deltaY > 0 && lockProgress < 1) {
                isLocked = true;
                lockProgress = 0;
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                processSection.scrollIntoView({ behavior: 'auto' });
                updateProcessVisuals(0);
            }
            // From bottom going up
            else if (deltaY < 0 && lockProgress > 0) {
                isLocked = true;
                lockProgress = 1;
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                processSection.scrollIntoView({ behavior: 'auto' });
                updateProcessVisuals(1);
            }
        }
    }, { passive: false });
  }

  // Footer Clock
  const footerClock = document.getElementById('footerClock');
  if (footerClock) {
    function updateClock() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
      });
      footerClock.innerText = timeString + " PARIS TIME";
    }
    updateClock();
    setInterval(updateClock, 1000);
  }
});
