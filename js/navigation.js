const Navigation = (() => {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = header?.querySelector('.header__nav');
  const hero = document.getElementById('hero');
  const navLinks = [...(nav?.querySelectorAll('.header__link[data-scroll]') || [])];

  let navLockId = null;

  function setActiveNav(sectionId) {
    navLinks.forEach((link) => {
      const isActive = sectionId && link.dataset.scroll === sectionId;
      link.classList.toggle('header__link--cta', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function lockNav(sectionId) {
    navLockId = sectionId;
    setActiveNav(sectionId);
  }

  function unlockNav() {
    navLockId = null;
    updateActiveSection();
  }

  function updateActiveSection() {
    if (navLockId) {
      setActiveNav(navLockId);
      return;
    }

    const offset = (header?.offsetHeight || 72) + 48;
    const heroThreshold = hero ? hero.offsetHeight * 0.4 : 300;

    if (window.scrollY < heroThreshold) {
      setActiveNav(null);
      return;
    }

    let currentId = navLinks[0]?.dataset.scroll || null;

    navLinks.forEach((link) => {
      const section = document.getElementById(link.dataset.scroll);
      if (!section) return;
      const top = section.getBoundingClientRect().top;
      if (top <= offset) {
        currentId = link.dataset.scroll;
      }
    });

    setActiveNav(currentId);
  }

  function updateHeader() {
    if (window.scrollY > 40) {
      header?.classList.add('is-scrolled');
      header?.classList.remove('header--hero');
    } else {
      header?.classList.remove('is-scrolled');
      header?.classList.add('header--hero');
    }
    updateActiveSection();
  }

  function scrollToSection(target, id, lenis) {
    const scrollDuration = 1.2;
    const unlockDelay = scrollDuration * 1000 + 80;

    if (lenis) {
      lenis.scrollTo(target, {
        offset: -72,
        duration: scrollDuration,
        onComplete: unlockNav,
      });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(unlockNav, unlockDelay);
    }
  }

  function initScrollLinks(lenis) {
    document.querySelectorAll('[data-scroll]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('data-scroll') || link.getAttribute('href')?.slice(1);
        const target = document.getElementById(id);
        if (!target) return;

        if (link.classList.contains('header__link')) {
          lockNav(id);
        }

        nav?.classList.remove('is-open');
        menuToggle?.setAttribute('aria-expanded', 'false');

        scrollToSection(target, id, lenis);
      });
    });
  }

  function init() {
    header?.classList.add('header--hero');
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    menuToggle?.addEventListener('click', () => {
      const open = nav?.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    return { initScrollLinks, updateHeader, setActiveNav, unlockNav };
  }

  return { init };
})();
