(() => {
  const opening = document.getElementById('opening');
  const site = document.getElementById('site');
  const openButton = document.getElementById('openInvitation');

  const music = document.getElementById('music');
  const musicButton = document.getElementById('musicButton');
  const musicState = document.getElementById('musicState');

  const GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzu9Sq5YjiA0HlJg0i1xWdWA7qRMAGH4vrZWHc52aCjkMUV3I08tGUWEFgyXrQT4-4/exec';

  const supportedLanguages = new Set(['ka', 'ru']);

  const storedLanguage = localStorage.getItem('invitation-language');

  let currentLanguage = supportedLanguages.has(storedLanguage)
    ? storedLanguage
    : 'ka';

  const translations = document.querySelectorAll('[data-ka][data-ru]');

  const ariaTranslations = document.querySelectorAll(
    '[data-aria-ka][data-aria-ru]'
  );

  const languageButtons = document.querySelectorAll(
    '[data-language-button]'
  );

  function setLanguage(language) {
    if (!supportedLanguages.has(language)) return;

    currentLanguage = language;
    document.documentElement.lang = language;

    translations.forEach((element) => {
      const value = element.dataset[language];

      if (value !== undefined) {
        element.innerHTML = value;
      }
    });

    ariaTranslations.forEach((element) => {
      const ariaValue =
        language === 'ka'
          ? element.dataset.ariaKa
          : element.dataset.ariaRu;

      if (ariaValue) {
        element.setAttribute('aria-label', ariaValue);
      }
    });

    languageButtons.forEach((button) => {
      const isActive =
        button.dataset.languageButton === language;

      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    document.title =
      language === 'ka'
        ? 'დავითი და ქეთო — საქორწილო მოსაწვევი'
        : 'Давид и Кето — Свадебное приглашение';

    localStorage.setItem('invitation-language', language);
  }

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.languageButton);
    });
  });

  setLanguage(currentLanguage);

  async function playMusic() {
    if (!music) return;

    try {
      await music.play();

      musicButton?.classList.add('is-playing');

      if (musicState) {
        musicState.textContent = 'PAUSE';
      }
    } catch (error) {
      console.warn('Music could not start automatically:', error);
    }
  }

  function pauseMusic() {
    if (!music) return;

    music.pause();
    musicButton?.classList.remove('is-playing');

    if (musicState) {
      musicState.textContent = 'PLAY';
    }
  }

  async function toggleMusic() {
    if (!music) return;

    if (music.paused) {
      await playMusic();
    } else {
      pauseMusic();
    }
  }

  musicButton?.addEventListener('click', toggleMusic);

  openButton?.addEventListener('click', async () => {
    if (openButton.classList.contains('is-opening')) return;

    openButton.classList.add('is-opening');
    openButton.setAttribute('aria-disabled', 'true');

    await playMusic();

    window.setTimeout(() => {
      opening?.classList.add('is-hidden');

      if (site) {
        site.classList.add('is-visible');
        site.setAttribute('aria-hidden', 'false');
      }

      document.body.classList.remove('is-locked');

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }, 1750);
  });

  const targetDate = new Date(
    '2026-09-02T18:00:00+04:00'
  ).getTime();

  function updateCountdown() {
    const distance = Math.max(
      0,
      targetDate - Date.now()
    );

    const values = {
      days: Math.floor(distance / 86400000),

      hours: Math.floor(
        (distance % 86400000) / 3600000
      ),

      minutes: Math.floor(
        (distance % 3600000) / 60000
      ),

      seconds: Math.floor(
        (distance % 60000) / 1000
      )
    };

    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = String(value).padStart(2, '0');
      }
    });
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const revealElements =
    document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add('is-in');
    });
  }

  const detailsModal =
    document.getElementById('detailsModal');

  const rsvpModal =
    document.getElementById('rsvpModal');

  const detailsButton =
    document.getElementById('detailsButton');

  const rsvpButton =
    document.getElementById('rsvpButton');

  let lockedScrollY = 0;

  function lockPageForModal() {
    lockedScrollY = window.scrollY;

    document.body.classList.add('is-locked');

    Object.assign(document.body.style, {
      position: 'fixed',
      top: `-${lockedScrollY}px`,
      left: '0',
      right: '0',
      width: '100%'
    });
  }

  function unlockPageAfterModal() {
    document.body.classList.remove('is-locked');

    Object.assign(document.body.style, {
      position: '',
      top: '',
      left: '',
      right: '',
      width: ''
    });

    window.scrollTo(0, lockedScrollY);
  }

  function openModal(modal) {
    if (!modal || modal.open) return;

    lockPageForModal();
    modal.showModal();
  }

  function closeModal(modal) {
    if (!modal || !modal.open) return;

    modal.close();
  }

  detailsButton?.addEventListener('click', () => {
    openModal(detailsModal);
  });

  rsvpButton?.addEventListener('click', () => {
    openModal(rsvpModal);
  });

  document
    .querySelectorAll('[data-close]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const modal = document.getElementById(
          button.dataset.close
        );

        closeModal(modal);
      });
    });

  [detailsModal, rsvpModal]
    .filter(Boolean)
    .forEach((modal) => {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          closeModal(modal);
        }
      });

      modal.addEventListener('cancel', (event) => {
        event.preventDefault();
        closeModal(modal);
      });

      modal.addEventListener(
        'close',
        unlockPageAfterModal
      );
    });

  const rsvpForm =
    document.getElementById('rsvpForm');

  rsvpForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = form.querySelector(
      'button[type="submit"]'
    );
    const formStatus =
      document.getElementById('formStatus');

    const formData = new FormData(form);

    const data = {
      name: String(formData.get('name') || '').trim(),
      attendance: String(
        formData.get('attendance') || ''
      ),
      message: String(
        formData.get('message') || ''
      ).trim(),
      language: currentLanguage,
      savedAt: new Date().toISOString()
    };

    if (!data.name || !data.attendance) {
      if (formStatus) {
        formStatus.textContent =
          currentLanguage === 'ka'
            ? 'გთხოვთ, შეავსოთ აუცილებელი ველები.'
            : 'Пожалуйста, заполните обязательные поля.';
      }

      return;
    }

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.textContent =
        currentLanguage === 'ka'
          ? 'იგზავნება...'
          : 'ОТПРАВКА...';
    }

    if (formStatus) {
      formStatus.textContent = '';
    }

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(data)
      });

      localStorage.setItem(
        'keto-daviti-rsvp',
        JSON.stringify(data)
      );

      if (formStatus) {
        formStatus.textContent =
          currentLanguage === 'ka'
            ? 'მადლობა! თქვენი პასუხი მიღებულია.'
            : 'Спасибо! Ваш ответ получен.';
      }

      form.reset();
    } catch (error) {
      console.error('RSVP submission failed:', error);

      if (formStatus) {
        formStatus.textContent =
          currentLanguage === 'ka'
            ? 'დაფიქსირდა შეცდომა. გთხოვთ, სცადოთ ხელახლა.'
            : 'Произошла ошибка. Пожалуйста, попробуйте ещё раз.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        submitButton.textContent =
          currentLanguage === 'ka'
            ? 'გაგზავნა'
            : 'ОТПРАВИТЬ';
      }
    }
  });
})();