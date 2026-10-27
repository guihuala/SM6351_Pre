// Navigation stays available even if the visualization library or data cannot load.
(() => {
  const tabs = [...document.querySelectorAll('[role="tab"][data-tab]')];
  const keys = tabs.map(tab => tab.dataset.tab);
  function fromHash() {
    const legacy = { question: 'demo', intro: 'demo', explore: 'demo', design: 'build', discussion: 'practice' };
    const hash = window.location.hash.slice(1);
    const key = legacy[hash] || hash;
    return keys.includes(key) ? key : 'demo';
  }
  function show(key, { updateHistory = true, focusTab = false, scroll = true } = {}) {
    if (!keys.includes(key)) key = 'demo';
    const focused = document.activeElement;
    const hidingFocusedPanel = focused?.closest('[role="tabpanel"]')?.id !== `panel-${key}` && focused?.closest('[role="tabpanel"]');
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === key;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
    if (updateHistory && window.location.hash !== `#${key}`) {
      window.history.pushState(null, '', `#${key}`);
    }
    if (focusTab || hidingFocusedPanel) document.getElementById(`tab-${key}`).focus({ preventScroll: true });
    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => show(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      show(tabs[next].dataset.tab, { focusTab: true });
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const target = link.getAttribute('href').slice(1);
    if (!keys.includes(target) && target !== 'intro') return;
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const key = target === 'intro' ? 'demo' : target;
      show(key);
      document.getElementById(`panel-${key}`).focus({ preventScroll: true });
    });
  });
  window.addEventListener('popstate', () => show(fromHash(), { updateHistory: false }));
  window.addEventListener('hashchange', () => show(fromHash(), { updateHistory: false }));
  window.LaxTabs = { show };
  show(fromHash(), { updateHistory: false, scroll: false });
})();
