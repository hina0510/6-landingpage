const Motion = (() => {
  const showcaseSlides = [
    '올리브영 5% 추가 할인',
    '쿠폰 중복 적용 가능',
    '네이버페이 포인트 5% 적립',
    '신규 발급 1만원 쿠폰',
    '월 3회 무료배송',
    'VIP 월간 혜택',
  ];

  let showcaseIndex = 0;
  let showcaseTimer = null;
  let showcasePaused = false;

  const REVEAL_FROM = { opacity: 0, y: 40 };
  const REVEAL_TO = { opacity: 1, y: 0, duration: 1, ease: 'power3.out' };
  const TOGGLE = 'play reverse play reverse';

  const MEMBERSHIP_EVENT = { duration: 1.5, stagger: 0.3 };

  function revealElements(selector, options = {}) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.utils.toArray(selector).forEach((el) => {
      gsap.fromTo(el, REVEAL_FROM, {
        ...REVEAL_TO,
        duration: options.duration ?? 1,
        scrollTrigger: {
          trigger: el,
          start: options.start ?? 'top 85%',
          end: options.end ?? 'bottom 15%',
          toggleActions: TOGGLE,
        },
      });
    });
  }

  function revealGroup(elements, trigger, options = {}) {
    if (!elements?.length || typeof gsap === 'undefined') return;

    gsap.fromTo(elements, REVEAL_FROM, {
      ...REVEAL_TO,
      duration: options.duration ?? 1,
      stagger: options.stagger ?? 0.12,
      scrollTrigger: {
        trigger,
        start: options.start ?? 'top 80%',
        end: options.end ?? 'bottom 20%',
        toggleActions: TOGGLE,
      },
    });
  }

  function initScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    revealElements('.reveal:not(.prize-card):not(.scenario-step):not(.faq-item):not(.membership-card)');

    revealElements('#membership .section-title.reveal, #membership .section-desc.reveal', {
      duration: MEMBERSHIP_EVENT.duration,
      start: 'top 80%',
      end: 'bottom 25%',
    });

    revealElements('#event .section-title.reveal, #event .section-desc.reveal, #event .event__cta.reveal', {
      duration: MEMBERSHIP_EVENT.duration,
      start: 'top 80%',
      end: 'bottom 25%',
    });

    revealGroup(
      document.querySelectorAll('.event__prizes .prize-card'),
      '.event__prizes',
      { ...MEMBERSHIP_EVENT, start: 'top 80%', end: 'bottom 25%' }
    );

    revealGroup(
      document.querySelectorAll('.scenario-step.reveal'),
      '.scenario__flow',
      { duration: 0.8, start: 'top 85%', end: 'bottom 20%' }
    );

    revealGroup(
      document.querySelectorAll('.faq-item.reveal'),
      '.faq__list',
      { duration: 0.8, stagger: 0.1, start: 'top 85%', end: 'bottom 15%' }
    );

    revealGroup(
      document.querySelectorAll('.membership-card.reveal'),
      '.membership__grid',
      { ...MEMBERSHIP_EVENT, start: 'top 80%', end: 'bottom 25%' }
    );
  }

  function updateShowcaseSlide(index) {
    const title = document.querySelector('.showcase__title');
    const counter = document.getElementById('showcase-counter');
    const text = showcaseSlides[index];

    if (title && typeof gsap !== 'undefined') {
      gsap.to(title, {
        opacity: 0,
        y: 8,
        duration: 0.25,
        onComplete: () => {
          title.textContent = text;
          gsap.to(title, { opacity: 1, y: 0, duration: 0.35 });
        },
      });
    } else if (title) {
      title.textContent = text;
    }

    if (counter) counter.textContent = `${index + 1} / ${showcaseSlides.length}`;

    document.querySelectorAll('.showcase__slide').forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
  }

  function initShowcaseCarousel() {
    const pauseBtn = document.getElementById('showcase-pause');

    const titleEl = document.querySelector('.showcase__title');
    if (titleEl?.textContent.trim()) {
      showcaseSlides[0] = titleEl.textContent.trim();
    }

    function tick() {
      if (showcasePaused) return;
      showcaseIndex = (showcaseIndex + 1) % showcaseSlides.length;
      updateShowcaseSlide(showcaseIndex);
    }

    showcaseTimer = setInterval(tick, 4000);

    pauseBtn?.addEventListener('click', () => {
      showcasePaused = !showcasePaused;
      pauseBtn.setAttribute('aria-label', showcasePaused ? '재생' : '일시정지');
      const icon = pauseBtn.querySelector('svg');
      if (icon) {
        icon.innerHTML = showcasePaused
          ? '<path d="M10 6 L26 18 L10 30 Z" fill="currentColor"/>'
          : '<rect x="2" y="1" width="3" height="12" rx="1"/><rect x="9" y="1" width="3" height="12" rx="1"/>';
      }
    });
  }

  function initStickyCta() {
    const sticky = document.getElementById('sticky-cta');
    const hero = document.getElementById('hero');
    if (!sticky || !hero || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom top',
      onEnter: () => sticky.classList.add('is-visible'),
      onLeaveBack: () => sticky.classList.remove('is-visible'),
    });
  }

  function init() {
    initScrollReveal();
    initShowcaseCarousel();
    initStickyCta();
  }

  return { init };
})();
