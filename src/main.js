(() => {
  const { photos, pageSize, rtl } = window.GH;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const burger = $('.burger');
  const mobileNav = $('#mobile-nav');
  const setMenu = (open) => { burger.setAttribute('aria-expanded', String(open)); mobileNav.hidden = !open; };
  burger.addEventListener('click', () => setMenu(mobileNav.hidden));
  $$('a', mobileNav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); burger.focus(); } });

  // Projects: filter + "show more"
  const tiles = $$('.tile');
  const filters = $$('.filter');
  const moreBtn = $('.show-more');
  let filter = 'all';
  let showAll = false;
  const matches = (cat) => filter === 'all' || cat === filter;
  function renderGallery() {
    const visible = tiles.filter((t) => matches(t.dataset.cat));
    tiles.forEach((t) => { t.hidden = true; });
    visible.forEach((t, i) => { t.hidden = !showAll && i >= pageSize; });
    const extra = visible.length - pageSize;
    moreBtn.parentElement.hidden = showAll || extra <= 0;
    moreBtn.textContent = `${moreBtn.dataset.label} (${extra})`;
  }
  filters.forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.filter;
    showAll = false;
    filters.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderGallery();
  }));
  moreBtn.addEventListener('click', () => { showAll = true; renderGallery(); });
  renderGallery();

  // Lightbox: steps through every photo of the current filter
  const lb = $('#lightbox');
  const lbImg = $('.lb-img', lb);
  const lbCap = $('.lb-cap', lb);
  let lbList = [];
  let lbIndex = -1;
  let returnFocus = null;
  function showLb() {
    const p = lbList[lbIndex];
    lbImg.src = p.src;
    lbImg.alt = p.cap;
    lb.setAttribute('aria-label', p.cap);
    lbCap.innerHTML = '';
    lbCap.append(p.cap + ' ');
    const count = document.createElement('span');
    count.className = 'lb-count';
    count.dir = 'ltr';
    count.textContent = `${lbIndex + 1} / ${lbList.length}`;
    lbCap.append(count);
  }
  function openLb(tile) {
    const tileStart = Number(tile.dataset.start);
    lbList = photos.map((p, i) => ({ ...p, i })).filter((p) => matches(p.cat));
    lbIndex = lbList.findIndex((p) => p.i === tileStart);
    returnFocus = tile;
    showLb();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.lb-close', lb).focus();
  }
  function closeLb() {
    if (lb.hidden) return;
    lb.hidden = true;
    document.body.style.overflow = '';
    if (returnFocus) returnFocus.focus({ preventScroll: true });
  }
  const step = (d) => { lbIndex = (lbIndex + d + lbList.length) % lbList.length; showLb(); };
  tiles.forEach((t) => t.addEventListener('click', () => openLb(t)));
  $('.lb-close', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', () => step(-1));
  $('.lb-next', lb).addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') step(rtl ? 1 : -1);
    else if (e.key === 'ArrowRight') step(rtl ? -1 : 1);
    else if (e.key === 'Tab') {
      const f = $$('button', lb);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // FAQ: one open at a time
  const faqBtns = $$('.faq-q');
  faqBtns.forEach((b) => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    faqBtns.forEach((x) => {
      const on = x === b && open;
      x.setAttribute('aria-expanded', String(on));
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
  }));

  // Quote form -> Netlify Forms
  const form = $('.quote-form');
  const success = $('.form-success');
  const errorBox = $('.form-error');
  const submitBtn = $('.submit', form);
  const submitLabel = submitBtn.textContent;
  const thanks = $('.thanks', success);
  function showSuccess(name) {
    const first = (name || '').trim().split(/\s+/)[0];
    thanks.textContent = `${thanks.dataset.thanks}${first ? `, ${first}` : ''}!`;
    form.hidden = true;
    success.hidden = false;
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    $$('.invalid', form).forEach((el) => el.classList.remove('invalid'));
    if (!form.checkValidity()) {
      const bad = $$('input, select, textarea', form).filter((el) => !el.checkValidity());
      bad.forEach((el) => el.classList.add('invalid'));
      bad[0].focus();
      bad[0].reportValidity();
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = submitBtn.dataset.sending;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      showSuccess(form.elements.name.value);
      form.reset();
    } catch {
      errorBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });
  $('.again', success).addEventListener('click', () => { success.hidden = true; form.hidden = false; form.elements.name.focus(); });
  // No-JS fallback lands back here with ?sent=1
  if (new URLSearchParams(location.search).has('sent')) showSuccess('');

  // Floating WhatsApp: hidden while the contact section is on screen
  const wa = $('.wa-float');
  const contact = $('#contact');
  function syncWa() {
    const r = contact.getBoundingClientRect();
    const inView = r.top < innerHeight * 0.85 && r.bottom > innerHeight * 0.15;
    wa.classList.toggle('is-hidden', inView);
    wa.tabIndex = inView ? -1 : 0;
    if (inView) wa.setAttribute('aria-hidden', 'true'); else wa.removeAttribute('aria-hidden');
  }
  addEventListener('scroll', syncWa, { passive: true });
  addEventListener('resize', syncWa);
  syncWa();
  if (!reduceMotion) {
    wa.classList.add('pulse');
    wa.addEventListener('animationend', () => wa.classList.remove('pulse'), { once: true });
  }

  // Scroll reveal: never hides content already in view
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('revealed');
      io.unobserve(en.target);
    }), { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    $$('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('will-reveal');
      io.observe(el);
    });
  }
})();
