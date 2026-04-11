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

  // --- Navbar Visibility & Color Switcher ---
  const navbar = document.getElementById('navbar');
  const navTriggerSections = document.querySelectorAll('section[data-nav-dark="true"]');
  
  if (navbar) {
    const handleNavbarScroll = () => {
      const scrolled = window.scrollY > 50;
      let isDarkNav = false;
      const navbarRect = navbar.getBoundingClientRect();
      const navbarCenter = navbarRect.top + navbarRect.height / 2;

      // 1. Check for light sections to switch text color
      navTriggerSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (navbarCenter >= rect.top && navbarCenter <= rect.bottom) {
          isDarkNav = true;
        }
      });

      // 2. Apply classes
      if (scrolled) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }

      if (isDarkNav) {
        navbar.classList.add('nav-is-dark');
      } else {
        navbar.classList.remove('nav-is-dark');
      }
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(handleNavbarScroll);
    }, { passive: true });
    
    // Run once on load
    handleNavbarScroll();
  }


  // --- METHODOLOGY SCROLLYTELLING LOGIC ---
  const scrollyProgress = document.getElementById('scrollyProgress');
  const scrollyItems = document.querySelectorAll('.scrolly-item');
  const scrollySection = document.getElementById('process');

  if (scrollySection && scrollyProgress) {
    // 1. Progressive Timeline Fill
    const updateScrollyTimeline = () => {
      const rect = scrollySection.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewHeight = window.innerHeight;
      
      // Start filling when the section is partially visible
      const startPoint = viewHeight * 0.5;
      const progress = Math.max(0, Math.min(1, (startPoint - rect.top) / (sectionHeight - startPoint)));
      
      scrollyProgress.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateScrollyTimeline);
    }, { passive: true });

    // 2. Observer for Badges and Row Visibility
    const scrollyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const badge = entry.target.querySelector('.scrolly-badge');
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.classList.remove('not-visible');
          if (badge) badge.classList.add('active');
        } else if (entry.boundingClientRect.top > 0) {
          // Only remove if we are scrolling back up
          entry.target.classList.remove('is-visible');
          entry.target.classList.add('not-visible');
          if (badge) badge.classList.remove('active');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    });

    scrollyItems.forEach(item => {
      item.classList.add('not-visible'); // Initial state
      scrollyObserver.observe(item);
    });

    updateScrollyTimeline();
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
