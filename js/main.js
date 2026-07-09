document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Scroll Effects ---
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navLinksMenu = document.querySelector('.nav-links');

  // Sticky Navbar & Back to Top visibility
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Mobile Menu Toggle
  if (mobileNavToggle && navLinksMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navLinksMenu.classList.toggle('open');
      const bars = mobileNavToggle.querySelectorAll('.bar');
      bars[0].style.transform = navLinksMenu.classList.contains('open') ? 'rotate(45deg) translate(5px, 6px)' : 'none';
      bars[1].style.opacity = navLinksMenu.classList.contains('open') ? '0' : '1';
      bars[2].style.transform = navLinksMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -6px)' : 'none';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksMenu.classList.remove('open');
        const bars = mobileNavToggle.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      });
    });
  }

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active Link Observer
  const activeLinkObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the middle part of viewport
    threshold: 0
  };

  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, activeLinkObserverOptions);

  sections.forEach(section => {
    if (section.getAttribute('id')) {
      activeLinkObserver.observe(section);
    }
  });


  // --- Theme Toggler (Dark/Light) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Initialize theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} mode!`, 'success');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }


  // --- Typing Effect ---
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const roles = JSON.parse(typingElement.getAttribute('data-roles')) || ["Full Stack Developer."];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 120;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1500; // Pause at full word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
      }

      setTimeout(type, typingSpeed);
    }
    
    // Start typing effect with a slight delay
    setTimeout(type, 1000);
  }


  // --- Scroll Animations (Intersection Observer) ---
  const scrollElements = document.querySelectorAll('.animate-on-scroll');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // Trigger skill animations specifically if this is the skills section
        if (entry.target.id === 'skills') {
          animateSkills();
        }
      }
    });
  }, { threshold: 0.15 });

  scrollElements.forEach(el => scrollObserver.observe(el));

  function animateSkills() {
    // Personal Skill progress bars
    const progressFills = document.querySelectorAll('.progress-bar-fill');
    progressFills.forEach(fill => {
      const val = fill.getAttribute('data-value');
      fill.style.width = `${val}%`;
    });

    // Software Skill circular bars
    const circleFills = document.querySelectorAll('.circle-fill');
    circleFills.forEach(circle => {
      const val = parseFloat(circle.getAttribute('data-value')); // e.g. 0.9 for 90%
      const radius = 50; // matching SVG r="50"
      const circumference = 2 * Math.PI * radius; // ~314
      const offset = circumference * (1 - val);
      circle.style.strokeDashoffset = offset;
    });
  }


  // --- Portfolio Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // --- Details Modal for Portfolio ---
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalImage = document.querySelector('.modal-image-wrap img');
  const modalTag = document.querySelector('.modal-tag');
  const modalTitle = document.querySelector('.modal-title');
  const modalDesc = document.querySelector('.modal-desc');
  const modalLinks = document.querySelector('.modal-links');
  const portfolioCardLinks = document.querySelectorAll('.portfolio-popup-trigger');

  if (portfolioCardLinks.length > 0 && modalOverlay) {
    portfolioCardLinks.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const card = trigger.closest('.portfolio-item');
        
        // Extract data
        const imgUrl = card.querySelector('.portfolio-img-wrap img').getAttribute('src');
        const tag = card.querySelector('.portfolio-tag').textContent;
        const title = card.querySelector('.portfolio-item-title').textContent;
        const longDesc = card.querySelector('.hidden-content').innerHTML;
        const links = card.querySelector('.portfolio-buttons').cloneNode(true);
        
        // Format cloned buttons
        links.querySelectorAll('a').forEach(btn => {
          btn.className = 'btn btn-secondary'; // give standard theme button style inside modal
        });

        // Set modal contents
        modalImage.setAttribute('src', imgUrl);
        modalTag.textContent = tag;
        modalTitle.textContent = title;
        modalDesc.innerHTML = longDesc;
        modalLinks.innerHTML = '';
        modalLinks.appendChild(links);

        // Open modal
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
      });
    });

    const closeModal = () => {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });
  }


  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contact_form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showToast('Please fill out all required fields (Name, Email, Message).', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // If validation succeeds, simulate sending message
      showToast('Sending message...', 'success');
      
      // Simulate AJAX request
      setTimeout(() => {
        showToast('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        
        // Reset floating labels (by triggering focusout styling manually if needed)
        contactForm.querySelectorAll('.form-input').forEach(input => {
          input.blur();
        });
      }, 1500);
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }


  // --- Custom Toast Alert ---
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Add appropriate icon based on type
    const icon = type === 'success' ? 
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>` :
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Trigger transition
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Remove toast after 4s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }
});
