(() => {
  const opening = document.getElementById('opening');
  const site = document.getElementById('site');
  const openButton = document.getElementById('openInvitation');

  const music = document.getElementById('music');
  const musicButton = document.getElementById('musicButton');
  const musicState = document.getElementById('musicState');

  let currentLanguage =
    localStorage.getItem('invitation-language') || 'ka';

  const translations = document.querySelectorAll(
    '[data-ka][data-ru]'
  );

  const ariaTranslations = document.querySelectorAll(
    '[data-aria-ka][data-aria-ru]'
  );

  const languageButtons = document.querySelectorAll(
    '[data-language-button]'
  );

  function setLanguage(language) {
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

      element.setAttribute('aria-label', ariaValue);
    });

    languageButtons.forEach((button) => {
      const isActive =
        button.dataset.languageButton === language;

      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    document.title =
      language === 'ka'
        ? 'ქეთო და დავითი — საქორწილო მოსაწვევი'
        : 'Кето и Давити — Свадебное приглашение';

    localStorage.setItem(
      'invitation-language',
      language
    );
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

      if (musicButton) {
        musicButton.classList.add('is-playing');
      }

      if (musicState) {
        musicState.textContent = 'PAUSE';
      }
    } catch (error) {
      console.warn(
        'Music could not start automatically:',
        error
      );
    }
  }

  function pauseMusic() {
    if (!music) return;

    music.pause();

    if (musicButton) {
      musicButton.classList.remove('is-playing');
    }

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

  if (musicButton) {
    musicButton.addEventListener(
      'click',
      toggleMusic
    );
  }

  if (openButton) {
    openButton.addEventListener('click', async () => {
      if (
        openButton.classList.contains('is-opening')
      ) {
        return;
      }

      openButton.classList.add('is-opening');
      openButton.setAttribute('aria-disabled', 'true');

      await playMusic();

      /*
        0.0s  — flap starts opening
        0.3s  — burgundy liner appears
        0.45s — flowers rise
        1.7s  — intro fades out
      */

      window.setTimeout(() => {
        if (opening) {
          opening.classList.add('is-hidden');
        }

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
  }

  const targetDate = new Date(
    '2026-09-02T18:00:00+04:00'
  ).getTime();

  function updateCountdown() {
    const distance = Math.max(
      0,
      targetDate - Date.now()
    );

    const values = {
      days: Math.floor(
        distance / 86400000
      ),

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

    Object.entries(values).forEach(
      ([id, value]) => {
        const element =
          document.getElementById(id);

        if (element) {
          element.textContent =
            String(value).padStart(2, '0');
        }
      }
    );
  }

  updateCountdown();

  window.setInterval(
    updateCountdown,
    1000
  );

  const revealElements =
    document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add('is-in');

            revealObserver.unobserve(
              entry.target
            );
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
    document.getElementById(
      'detailsModal'
    );

  const rsvpModal =
    document.getElementById(
      'rsvpModal'
    );

  const detailsButton =
    document.getElementById(
      'detailsButton'
    );

  const rsvpButton =
    document.getElementById(
      'rsvpButton'
    );

  let lockedScrollY = 0;

  function lockPageForModal() {
    lockedScrollY = window.scrollY;
    document.body.classList.add('is-locked');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockPageAfterModal() {
    document.body.classList.remove('is-locked');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
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

  if (detailsButton && detailsModal) {
    detailsButton.addEventListener('click', () => {
      openModal(detailsModal);
    });
  }

  if (rsvpButton && rsvpModal) {
    rsvpButton.addEventListener('click', () => {
      openModal(rsvpModal);
    });
  }

  document
    .querySelectorAll('[data-close]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        closeModal(
          document.getElementById(button.dataset.close)
        );
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

      modal.addEventListener('close', () => {
        unlockPageAfterModal();
      });
    });

  const rsvpForm =
    document.getElementById(
      'rsvpForm'
    );

  if (rsvpForm) {
    rsvpForm.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();

        const data = Object.fromEntries(
          new FormData(
            event.currentTarget
          )
        );

        data.language =
          currentLanguage;

        data.savedAt =
          new Date().toISOString();

        localStorage.setItem(
          'keto-daviti-rsvp',
          JSON.stringify(data)
        );

        const formStatus =
          document.getElementById(
            'formStatus'
          );

        if (formStatus) {
          formStatus.textContent =
            currentLanguage === 'ka'
              ? 'მადლობა! თქვენი პასუხი შენახულია.'
              : 'Спасибо! Ваш ответ сохранён.';
        }

        event.currentTarget.reset();
      }
    );
  }
})();