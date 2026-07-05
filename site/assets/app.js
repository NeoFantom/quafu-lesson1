(() => {
  const sections = [...document.querySelectorAll('main > section')];
  const currentIndex = () => {
    const viewportAnchor = window.scrollY + window.innerHeight * 0.35;
    let index = 0;
    sections.forEach((section, i) => {
      if (section.offsetTop <= viewportAnchor) index = i;
    });
    return index;
  };
  const go = (direction) => {
    if (!sections.length) return;
    const next = Math.max(0, Math.min(sections.length - 1, currentIndex() + direction));
    sections[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
    sections[next].setAttribute('tabindex', '-1');
    sections[next].focus({ preventScroll: true });
  };
  document.querySelector('[data-step="prev"]')?.addEventListener('click', () => go(-1));
  document.querySelector('[data-step="next"]')?.addEventListener('click', () => go(1));
  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.key.toLowerCase() === 'j') go(1);
    if (event.key.toLowerCase() === 'k') go(-1);
  });
})();
