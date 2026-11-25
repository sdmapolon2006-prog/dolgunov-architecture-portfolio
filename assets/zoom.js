(() => {
  const figures = document.querySelectorAll('.gallery figure, .project-board, .model-story figure');
  if (!figures.length || !window.HTMLDialogElement) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'zoom-dialog';
  dialog.setAttribute('aria-label', 'Просмотр изображения');
  dialog.innerHTML = '<div class="zoom-toolbar"><span>ПРОСМОТР ИЗОБРАЖЕНИЯ</span><div><button type="button" data-action="out" aria-label="Уменьшить">−</button><output aria-live="polite">100%</output><button type="button" data-action="in" aria-label="Увеличить">+</button><button type="button" data-action="close" aria-label="Закрыть просмотр">×</button></div></div><div class="zoom-scroll"><div class="zoom-content"></div></div><p class="zoom-help">Используйте кнопки или два пальца для увеличения; передвигайте увеличенное изображение.</p>';
  document.body.appendChild(dialog);
  const content = dialog.querySelector('.zoom-content'), scroll = dialog.querySelector('.zoom-scroll'), output = dialog.querySelector('output');
  let zoom = 1, startDistance = 0, startZoom = 1, lastFocus;
  const setZoom = value => { zoom = Math.min(4, Math.max(1, value)); content.style.width = `${zoom * 100}%`; output.textContent = `${Math.round(zoom * 100)}%`; };
  figures.forEach(figure => {
    const visual = figure.querySelector('img, svg'); if (!visual) return;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'zoom-open'; button.textContent = 'Увеличить';
    button.setAttribute('aria-label', `Увеличить: ${visual.getAttribute('alt') || visual.getAttribute('aria-label') || 'изображение'}`);
    figure.appendChild(button);
    button.addEventListener('click', () => { lastFocus = button; content.replaceChildren(visual.cloneNode(true)); setZoom(1); dialog.showModal(); scroll.scrollTo(0, 0); });
  });
  dialog.addEventListener('click', e => { const action = e.target.dataset.action; if (action === 'close') dialog.close(); if (action === 'in') setZoom(zoom * 1.3); if (action === 'out') setZoom(zoom / 1.3); });
  dialog.addEventListener('close', () => { content.replaceChildren(); if (lastFocus) lastFocus.focus(); });
  scroll.addEventListener('wheel', e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1)); } }, {passive:false});
  const distance = touches => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  scroll.addEventListener('touchstart', e => { if (e.touches.length === 2) { startDistance = distance(e.touches); startZoom = zoom; } }, {passive:true});
  scroll.addEventListener('touchmove', e => { if (e.touches.length === 2 && startDistance) { e.preventDefault(); setZoom(startZoom * distance(e.touches) / startDistance); } }, {passive:false});
  scroll.addEventListener('touchend', e => { if (e.touches.length < 2) startDistance = 0; }, {passive:true});
})();
