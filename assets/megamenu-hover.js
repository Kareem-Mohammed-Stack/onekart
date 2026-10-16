(() => {
  const initialize = (root) => {
    root.querySelectorAll('.header__inline-menu > ul > li').forEach((item) => {
      const details = item.querySelector('details');
      if (!details || item.dataset.orcaHoverReady) return;
      item.dataset.orcaHoverReady = 'true';
      const summary = details.querySelector('summary');
      let closeTimer;

      details.addEventListener('toggle', () => summary.setAttribute('aria-expanded', String(details.open)));
      item.addEventListener('mouseenter', () => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        clearTimeout(closeTimer);
        item.closest('ul').querySelectorAll('header-menu > details[open]').forEach((other) => {
          if (other !== details && !other.contains(document.activeElement)) other.open = false;
        });
        details.open = true;
      });
      item.addEventListener('mouseleave', () => {
        closeTimer = setTimeout(() => {
          if (!item.matches(':hover') && !item.contains(document.activeElement)) details.open = false;
        }, 180);
      });
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initialize(document), { once: true });
  } else {
    initialize(document);
  }
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
})();
