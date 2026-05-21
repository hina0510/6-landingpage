const Modal = (() => {
  function open(overlayEl) {
    if (!overlayEl) return;
    overlayEl.removeAttribute('hidden');
    requestAnimationFrame(() => overlayEl.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
  }

  function close(overlayEl) {
    if (!overlayEl) return;
    overlayEl.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => overlayEl.setAttribute('hidden', ''), 400);
  }

  function init(overlayId, closeSelectors = []) {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;

    closeSelectors.forEach((sel) => {
      const el = typeof sel === 'string' ? document.getElementById(sel) : sel;
      el?.addEventListener('click', () => close(overlay));
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(overlay);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close(overlay);
    });

    return { open: () => open(overlay), close: () => close(overlay) };
  }

  return { open, close, init };
})();
