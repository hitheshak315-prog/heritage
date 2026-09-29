/**
 * Karnataka Heritage – Museum & Cultural Portal
 * Core Client-side Script
 * Clean, lightweight vanilla JavaScript for interactive museum features
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Mobile Navigation Menu
  // ------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const isExpanded = mainNav.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile nav when clicking a link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          mainNav.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 2. Scroll-to-Top Button & Sticky Header Shadow
  // ------------------------------------------------------------------------
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  const siteHeader = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (scrollTopBtn) {
      if (scrollPos > 350) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    if (siteHeader) {
      if (scrollPos > 20) {
        siteHeader.style.boxShadow = '0 4px 15px rgba(36, 22, 16, 0.12)';
      } else {
        siteHeader.style.boxShadow = 'var(--shadow-sm)';
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------------
  // 3. Collection & Artifact Filtering and Live Search
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableCards = document.querySelectorAll('[data-category]');
  const searchInput = document.querySelector('.search-input');

  function applyFilters() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let visibleCount = 0;

    filterableCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = (card.querySelector('.card-title') || card.querySelector('h3') || card.querySelector('h4') || {}).textContent || '';
      const cardDesc = (card.querySelector('.card-desc') || card.querySelector('p') || {}).textContent || '';
      const textToSearch = (cardTitle + ' ' + cardDesc).toLowerCase();

      const matchesCategory = (selectedCategory === 'all' || cardCategory === selectedCategory);
      const matchesSearch = (!searchQuery || textToSearch.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const noResultsMsg = document.getElementById('no-results-msg');
    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // ------------------------------------------------------------------------
  // 4. Gallery Lightbox
  // ------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const galleryData = Array.from(galleryItems).map(item => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4') ? item.querySelector('h4').textContent : '';
      const tag = item.querySelector('span') ? item.querySelector('span').textContent : '';
      return {
        src: img ? img.getAttribute('src') : '',
        alt: img ? img.getAttribute('alt') : '',
        caption: title ? `${title} (${tag})` : (img ? img.getAttribute('alt') : '')
      };
    });

    function showLightbox(index) {
      if (index < 0) index = galleryData.length - 1;
      if (index >= galleryData.length) index = 0;
      currentIndex = index;

      const item = galleryData[currentIndex];
      if (item && lightboxImg) {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        if (lightboxCaption) {
          lightboxCaption.textContent = item.caption;
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    galleryItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        showLightbox(idx);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => showLightbox(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showLightbox(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
    });
  }

  // ------------------------------------------------------------------------
  // 5. Artifact Details Modal
  // ------------------------------------------------------------------------
  const artifactModal = document.getElementById('artifact-modal');
  const viewDetailBtns = document.querySelectorAll('.view-artifact-btn');

  const artifactDatabase = {
    'halmidi-inscription': {
      title: 'Halmidi Inscription (Replica)',
      period: 'c. 450 CE – Kadamba Dynasty',
      origin: 'Halmidi Village, Hassan District, Karnataka',
      material: 'Granite Stele / Stone Inscription',
      dimensions: 'Height: 120 cm, Width: 45 cm',
      accession: 'HK-EP-1894-01',
      description: 'The Halmidi inscription is the earliest known stone inscription written in the classical Kannada language and Kannada script. Discovered by archaeologist Dr. M. H. Krishna in 1936, the inscription records a land grant made by King Kakusthavarma of the Kadamba dynasty to a warrior named Vijaya for his valor in battle.',
      significance: 'Historic benchmark for Kannada epigraphy; confirms Kannada as an administrative and literary tongue by the mid-5th century.'
    },
    'hoysala-shilabalika': {
      title: 'Shilabalika (Madanika) Bracket Sculpture',
      period: 'c. 1117 CE – Hoysala Dynasty',
      origin: 'Chennakesava Temple Complex, Belur',
      material: 'Chloritic Schist (Soapstone)',
      dimensions: 'Height: 88 cm, Width: 32 cm',
      accession: 'HK-SC-1922-14',
      description: 'A masterpiece of Hoysala lapidary art depicting a Darpana Sundari (beauty with a mirror). Carved from soft soapstone that hardens over time, every bead of her ornaments, curled hair locks, and delicate finger expression is articulated with astonishing micro-detailing.',
      significance: 'Exemplifies the zenith of 12th-century Hoysala temple ornamentation during the reign of King Vishnuvardhana.'
    },
    'tipu-sword': {
      title: 'Steel Talwar of Tipu Sultan',
      period: 'c. 1782–1799 CE – Mysore Kingdom',
      origin: 'Srirangapatna Arsenal',
      material: 'Wootz Steel Blade with Gold Inlay & Tiger Hilt',
      dimensions: 'Total Length: 92 cm, Blade: 79 cm',
      accession: 'HK-WM-1901-08',
      description: 'Crafted from indigenous Karnataka wootz steel renowned for its distinctive damascened water pattern and extraordinary tensile hardness. The hilt is cast in bronze with gold damascened calligraphic inscriptions invoking divine protection and the stylized emblem of the tiger (Babri).',
      significance: 'Rare exemplar of late 18th-century South Indian metallurgy and the Mysore resistance against British colonial expansion.'
    },
    'chalukya-nataraja': {
      title: 'Badami Chalukya Bronze Dancing Shiva (Nataraja)',
      period: 'c. 7th Century CE – Western Chalukya',
      origin: 'Malaprabha Basin, Aihole/Badami',
      material: 'Cast Bronze (Lost-wax Cire Perdue Technique)',
      dimensions: 'Height: 64 cm, Width: 48 cm',
      accession: 'HK-BR-1935-03',
      description: 'This early bronze depicts Lord Shiva performing the cosmic dance with 16 dynamic arms holding musical instruments and sacred emblems. Unlike later Tamil Chola bronzes with circular halos (Prabhamandala), this early Karnataka Chalukya piece features an oval halo with delicate lotus bud terminals.',
      significance: 'Demonstrates the early experimental bronze casting schools of Aihole, often hailed as the cradle of Karnataka temple architecture.'
    },
    'vijayanagara-gold-coin': {
      title: 'Gold Varaha of Krishnadevaraya',
      period: 'c. 1509–1529 CE – Vijayanagara Empire',
      origin: 'Hampi Royal Mint',
      material: 'Gold (98% purity)',
      dimensions: 'Diameter: 12 mm, Weight: 3.4 grams',
      accession: 'HK-NU-1910-44',
      description: 'The Varaha was the standard gold currency of the Vijayanagara Empire, accepted across international maritime trade routes from Portugal to Persia. The obverse depicts seated Lord Venkateshwara and goddess Lakshmi, while the reverse bears the royal Nagari legend: "Sri Pratapa Krishna Raya".',
      significance: 'Direct numismatic evidence of the economic grandeur and international trade reach of 16th-century Vijayanagara.'
    },
    'palm-leaf-manuscript': {
      title: 'Palm-Leaf Manuscript of Vaddaradhane',
      period: 'c. 9th–10th Century CE (Copy c. 14th Century)',
      origin: 'Shravanabelagola Jain Matha Archive',
      material: 'Talipot Palm Leaf (Borassus) with Natural Ink',
      dimensions: 'Length: 38 cm, Width: 5 cm (42 folios)',
      accession: 'HK-MS-1948-07',
      description: 'Vaddaradhane by Shivakotiacharya is considered the oldest extant prose work in classical Kannada. It contains 19 stories of Jain saints and ascetics, detailing everyday life, trade routes, maritime merchants, and moral dilemmas in early medieval Karnataka.',
      significance: 'Invaluable linguistic foundation for Old Kannada (Halegannada) and medieval South Indian social history.'
    }
  };

  if (artifactModal && viewDetailBtns.length > 0) {
    const modalClose = artifactModal.querySelector('.modal-close');
    const modalTitle = artifactModal.querySelector('.modal-artifact-title');
    const modalPeriod = artifactModal.querySelector('.modal-artifact-period');
    const modalOrigin = artifactModal.querySelector('.modal-artifact-origin');
    const modalMaterial = artifactModal.querySelector('.modal-artifact-material');
    const modalDimensions = artifactModal.querySelector('.modal-artifact-dimensions');
    const modalAccession = artifactModal.querySelector('.modal-artifact-accession');
    const modalDesc = artifactModal.querySelector('.modal-artifact-desc');
    const modalSig = artifactModal.querySelector('.modal-artifact-significance');

    function openArtifactModal(id) {
      const data = artifactDatabase[id];
      if (!data) return;

      if (modalTitle) modalTitle.textContent = data.title;
      if (modalPeriod) modalPeriod.textContent = data.period;
      if (modalOrigin) modalOrigin.textContent = data.origin;
      if (modalMaterial) modalMaterial.textContent = data.material;
      if (modalDimensions) modalDimensions.textContent = data.dimensions;
      if (modalAccession) modalAccession.textContent = data.accession;
      if (modalDesc) modalDesc.textContent = data.description;
      if (modalSig) modalSig.textContent = data.significance;

      artifactModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeArtifactModal() {
      artifactModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    viewDetailBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-artifact-id');
        openArtifactModal(id);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeArtifactModal);
    artifactModal.addEventListener('click', (e) => {
      if (e.target === artifactModal) closeArtifactModal();
    });
  }

  // ------------------------------------------------------------------------
  // 6. FAQ Accordion
  // ------------------------------------------------------------------------
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isOpen = currentItem.classList.contains('active');

      // Close all siblings
      const siblingItems = currentItem.parentElement.querySelectorAll('.accordion-item');
      siblingItems.forEach(item => item.classList.remove('active'));

      // If it wasn't open, open it
      if (!isOpen) {
        currentItem.classList.add('active');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 7. Virtual Tour Stepper & Hotspot Switcher
  // ------------------------------------------------------------------------
  const tourContainer = document.querySelector('.tour-viewer-container');

  if (tourContainer) {
    const tourRooms = [
      {
        title: 'Room 1: Grand Museum Entrance & Foyer',
        subtitle: 'Colonial Architecture & Heritage Portico',
        description: 'Visitors enter through the iconic red brick neoclassical portico built in 1877 under the directorship of Col. Sankey. The foyer houses a majestic life-size marble statue of Maharaja Chamarajendra Wodeyar X and an introductory relief map of Karnataka historical sites.',
        image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Room 2: Epigraphical & Inscription Gallery',
        subtitle: 'Halmidi, Atakur & Ganga Dynasty Stones',
        description: 'This hall contains over 80 original stone and copper-plate inscriptions from the 4th through the 16th centuries. Highlights include the certified replica of the Halmidi Inscription (450 CE) and the Atakur Hero Stone (949 CE) depicting a hound fighting a wild boar.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Room 3: Hoysala & Chalukya Sculpture Hall',
        subtitle: 'Masterpieces in Chloritic Schist Soapstone',
        description: 'Showcasing intricate bracket figures (Madanikas), Surya statues, and celestial dancers recovered from Belur, Halebidu, and Aihole. The soapstone sculptures demonstrate the legendary miniature carving technique of sculptors Ruvari Mallitamma and Dasoja.',
        image: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Room 4: Royal Arms, Weapons & Numismatics',
        subtitle: 'Vijayanagara Swords, Cannons & Mysore Coinage',
        description: 'An extensive armoury hall featuring wootz steel curved talwars, chainmail suits, elephant goads (ankusha), matchlock rifles from Srirangapatna, and rare gold Pagodas and Varahas from the Vijayanagara and Keladi Nayaka eras.',
        image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=1200&q=80'
      },
      {
        title: 'Room 5: Special Exhibition Hall – Mysore Traditional Paintings',
        subtitle: 'Gesso Work, Pure Gold Leaf & Natural Pigments',
        description: 'Dedicated to the distinctive Mysore school of painting that flourished under Maharaja Krishnaraja Wodeyar III. Features masterpieces created using the intricate gesso embossing technique overlaid with pure 24-karat gold foil.',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
      }
    ];

    let currentRoomIndex = 0;
    const tourImg = tourContainer.querySelector('.tour-viewport img');
    const tourTitle = tourContainer.querySelector('.tour-overlay-info h3');
    const tourDesc = tourContainer.querySelector('.tour-overlay-info p');
    const tourIndicator = tourContainer.querySelector('.tour-room-indicator');
    const prevBtn = tourContainer.querySelector('.tour-nav-prev');
    const nextBtn = tourContainer.querySelector('.tour-nav-next');
    const thumbs = tourContainer.querySelectorAll('.tour-thumb');

    function updateTourRoom(idx) {
      if (idx < 0 || idx >= tourRooms.length) return;
      currentRoomIndex = idx;
      const room = tourRooms[currentRoomIndex];

      if (tourImg) {
        tourImg.style.opacity = '0.3';
        setTimeout(() => {
          tourImg.src = room.image;
          tourImg.style.opacity = '1';
        }, 150);
      }

      if (tourTitle) tourTitle.textContent = room.title;
      if (tourDesc) tourDesc.textContent = room.description;
      if (tourIndicator) tourIndicator.textContent = `Room ${currentRoomIndex + 1} of ${tourRooms.length}`;

      if (prevBtn) prevBtn.disabled = currentRoomIndex === 0;
      if (nextBtn) nextBtn.disabled = currentRoomIndex === tourRooms.length - 1;

      thumbs.forEach((th, i) => {
        th.classList.toggle('active', i === currentRoomIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateTourRoom(currentRoomIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateTourRoom(currentRoomIndex + 1));
    }

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => updateTourRoom(i));
    });

    updateTourRoom(0);
  }

  // ------------------------------------------------------------------------
  // 8. Interactive Heritage Quiz (Education Page)
  // ------------------------------------------------------------------------
  const quizContainer = document.getElementById('heritage-quiz');

  if (quizContainer) {
    const questions = [
      {
        question: 'Which is the earliest known stone inscription written in the Kannada language?',
        options: [
          'Aihole Inscription of Ravikirti',
          'Halmidi Inscription (c. 450 CE)',
          'Badami Cliff Inscription',
          'Atakur Inscription'
        ],
        correct: 1,
        explanation: 'The Halmidi Inscription discovered in Hassan district dates to c. 450 CE during the Kadamba dynasty and represents the oldest confirmed Kannada stone record.'
      },
      {
        question: 'The magnificent stone chariot dedicated to Garuda is situated in which Karnataka world heritage site?',
        options: [
          'Pattadakal',
          'Shravanabelagola',
          'Hampi (Vijayanagara)',
          'Badami Cave Temples'
        ],
        correct: 2,
        explanation: 'The famous Stone Chariot is located inside the Vijaya Vittala Temple complex at Hampi, a UNESCO World Heritage site.'
      },
      {
        question: 'Which dynasty was celebrated for its intricate soapstone star-shaped temple architecture at Belur and Halebidu?',
        options: [
          'Hoysala Dynasty',
          'Rashtrakuta Dynasty',
          'Bahmani Sultanate',
          'Western Ganga Dynasty'
        ],
        correct: 0,
        explanation: 'The Hoysala rulers (10th–14th century) built world-renowned temples on raised star-shaped platforms using chloritic schist soapstone.'
      },
      {
        question: 'Who was the brave 16th-century Queen of Ullal (Coastal Karnataka) who repeatedly defeated Portuguese naval forces?',
        options: [
          'Kittur Rani Chennamma',
          'Onake Obavva',
          'Rani Abbakka Chowta',
          'Rani Keladi Chennamma'
        ],
        correct: 2,
        explanation: 'Rani Abbakka Chowta of Ullal is celebrated as one of India\'s first female freedom fighters who repelled multiple Portuguese naval invasions.'
      },
      {
        question: 'Which visionary engineer and statesman from Karnataka was awarded the Bharat Ratna and designed the Krishna Raja Sagara (KRS) dam?',
        options: [
          'Sir M. Visvesvaraya',
          'Mirza Ismail',
          'K. Seshadri Iyer',
          'Purnaiah'
        ],
        correct: 0,
        explanation: 'Sir Mokshagundam Visvesvaraya (1861–1962) was a legendary civil engineer and 19th Diwan of Mysore whose birthday (September 15) is celebrated as Engineer\'s Day in India.'
      }
    ];

    let currentQ = 0;
    let score = 0;
    let answered = false;

    const qNumEl = quizContainer.querySelector('.quiz-q-num');
    const qTotalEl = quizContainer.querySelector('.quiz-q-total');
    const scoreEl = quizContainer.querySelector('.quiz-current-score');
    const questionTextEl = quizContainer.querySelector('.quiz-question');
    const optionsContainer = quizContainer.querySelector('.quiz-options');
    const explanationEl = quizContainer.querySelector('.quiz-explanation');
    const nextQBtn = quizContainer.querySelector('.quiz-next-btn');

    function renderQuestion(idx) {
      answered = false;
      const q = questions[idx];

      if (qNumEl) qNumEl.textContent = idx + 1;
      if (qTotalEl) qTotalEl.textContent = questions.length;
      if (scoreEl) scoreEl.textContent = score;
      if (questionTextEl) questionTextEl.textContent = q.question;

      if (explanationEl) {
        explanationEl.style.display = 'none';
        explanationEl.textContent = '';
      }

      if (nextQBtn) {
        nextQBtn.style.display = 'none';
        nextQBtn.textContent = idx === questions.length - 1 ? 'View Final Results' : 'Next Question →';
      }

      if (optionsContainer) {
        optionsContainer.innerHTML = '';
        q.options.forEach((optText, optIdx) => {
          const btn = document.createElement('button');
          btn.className = 'quiz-option';
          btn.textContent = optText;
          btn.addEventListener('click', () => handleOptionClick(optIdx, btn));
          optionsContainer.appendChild(btn);
        });
      }
    }

    function handleOptionClick(selectedIdx, clickedBtn) {
      if (answered) return;
      answered = true;

      const q = questions[currentQ];
      const allOptionBtns = optionsContainer.querySelectorAll('.quiz-option');

      if (selectedIdx === q.correct) {
        clickedBtn.classList.add('correct');
        score++;
        if (scoreEl) scoreEl.textContent = score;
      } else {
        clickedBtn.classList.add('incorrect');
        // Highlight correct option
        if (allOptionBtns[q.correct]) {
          allOptionBtns[q.correct].classList.add('correct');
        }
      }

      if (explanationEl) {
        explanationEl.textContent = q.explanation;
        explanationEl.style.display = 'block';
      }

      if (nextQBtn) {
        nextQBtn.style.display = 'inline-block';
      }
    }

    if (nextQBtn) {
      nextQBtn.addEventListener('click', () => {
        if (currentQ < questions.length - 1) {
          currentQ++;
          renderQuestion(currentQ);
        } else {
          // Show final result
          quizContainer.innerHTML = `
            <div class="text-center" style="padding: 2rem 1rem;">
              <span style="font-size: 3rem;">🏆</span>
              <h3 style="margin-top: 1rem; color: var(--maroon-deep);">Quiz Completed!</h3>
              <p class="lead" style="margin-bottom: 1.5rem;">
                You scored <strong>${score}</strong> out of <strong>${questions.length}</strong> on the Karnataka Heritage Quiz.
              </p>
              <p style="color: var(--text-muted); margin-bottom: 2rem;">
                ${score >= 4 ? 'Splendid! You have an exceptional knowledge of Karnataka\'s rich heritage and dynastic history!' : 'Good effort! Explore our museum galleries and artifact records to discover even more about Karnataka\'s past.'}
              </p>
              <button class="btn btn-primary" onclick="location.reload();">Retry Quiz ↻</button>
            </div>
          `;
        }
      });
    }

    renderQuestion(0);
  }

  // ------------------------------------------------------------------------
  // 9. Contact Form Validation
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('museum-contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const name = contactForm.querySelector('#contact-name');
      const email = contactForm.querySelector('#contact-email');
      const phone = contactForm.querySelector('#contact-phone');
      const subject = contactForm.querySelector('#contact-subject');
      const message = contactForm.querySelector('#contact-message');

      function validateField(field, condition, errorId) {
        const errorEl = document.getElementById(errorId);
        if (!condition) {
          if (errorEl) errorEl.style.display = 'block';
          field.style.borderColor = 'var(--danger)';
          isValid = false;
        } else {
          if (errorEl) errorEl.style.display = 'none';
          field.style.borderColor = 'var(--cream-border)';
        }
      }

      if (name) validateField(name, name.value.trim().length >= 2, 'name-error');
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(email, emailRegex.test(email.value.trim()), 'email-error');
      }
      if (phone && phone.value.trim().length > 0) {
        const phoneRegex = /^[0-9+\-\s]{8,15}$/;
        validateField(phone, phoneRegex.test(phone.value.trim()), 'phone-error');
      }
      if (subject) validateField(subject, subject.value.trim().length >= 3, 'subject-error');
      if (message) validateField(message, message.value.trim().length >= 10, 'message-error');

      if (isValid) {
        // Show success toast notice
        showToast('Thank you! Your message has been sent to the Museum Heritage Administration desk. Reference ID: HK-' + Math.floor(100000 + Math.random() * 900000));
        contactForm.reset();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 10. Toast Notification System
  // ------------------------------------------------------------------------
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  window.showToast = showToast;

  // ------------------------------------------------------------------------
  // 11. Animated Stats Counter (Intersection Observer)
  // ------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const interval = setInterval(() => {
            current += step;
            if (current >= target) {
              el.textContent = target.toLocaleString() + suffix;
              clearInterval(interval);
            } else {
              el.textContent = current.toLocaleString() + suffix;
            }
          }, 30);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(stat => observer.observe(stat));
  }
});
