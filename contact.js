// Contact form + scroll reveals for the contact page.
// A valid enquiry is posted to Netlify Forms (see data-netlify on the form); if that
// fails it opens the visitor's email app, pre-filled, addressed to connect@atlanticmedia.in.
(function () {
  var TO = 'connect@atlanticmedia.in';

  // scroll reveals (each concept uses its own class names)
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .fade, .mask, .up').forEach(function (el) { io.observe(el); });
  var nav = document.getElementById('nav');
  if (nav) addEventListener('scroll', function () { nav.classList.toggle('solid', scrollY > 40); }, { passive: true });

  var form = document.getElementById('enquiry');
  if (!form) return;
  var started = Date.now();
  var LIMIT = 3, WINDOW = 10 * 60 * 1000, KEY = 'am-concept-submits';

  function clean(v, max) { return v.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max); }
  function setErr(name, msg) {
    var el = form.querySelector('[data-err="' + name + '"]');
    var input = form.querySelector('[name="' + name + '"]');
    if (el) el.textContent = msg || '';
    if (input && input.setAttribute) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  // Validation rules, one per field (return '' when fine). Phone: exactly 10 digits, as dialled in India after +91.
  var RULES = {
    name: function (v) { v = clean(v, 80); return !v ? 'Please enter your name.' : /^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,79}$/u.test(v) ? '' : 'Use letters only.'; },
    phone: function (v) { return digits10(v).length === 10 ? '' : 'Enter your 10-digit mobile number.'; },
    email: function (v) { v = clean(v, 254); return !v ? 'Please enter your email address.' : /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,185}\.[A-Za-z]{2,24}$/.test(v) ? '' : 'Enter a valid email address.'; },
    type: function (v) { return ['Brand', 'Creator', 'Agency', 'Job applicant', 'Other'].indexOf(v) >= 0 ? '' : 'Please choose one.'; },
    message: function (v) { return /<\s*\/?\s*[a-z!]|javascript:|https?:\/\/|www\./i.test(v) ? 'Please don’t include links or code.' : ''; }
  };
  // Phone: only digits can be typed or pasted, never more than ten. A pasted "+91 …" or a leading 0 before the ten digits is dropped.
  function digits10(v) { var d = String(v || '').replace(/\D/g, ''); if (d.length > 10 && d.indexOf('91') === 0) d = d.slice(2); if (d.length > 10 && d.charAt(0) === '0') d = d.slice(1); return d.slice(0, 10); }
  var phoneInput = form.querySelector('[name="phone"]');
  if (phoneInput) phoneInput.addEventListener('input', function () { var d = digits10(phoneInput.value); if (phoneInput.value !== d) phoneInput.value = d; });
  // Check a field when the visitor leaves it; clear its message as soon as they start fixing it.
  Object.keys(RULES).forEach(function (name) {
    var el = form.querySelector('[name="' + name + '"]'); if (!el) return;
    el.addEventListener('blur', function () { if (el.value) setErr(name, RULES[name](el.value)); });
    el.addEventListener('input', function () { if (form.querySelector('[data-err="' + name + '"]').textContent) setErr(name, RULES[name](el.value)); });
    el.addEventListener('change', function () { setErr(name, RULES[name](el.value)); });
  });
  form.querySelectorAll('[name="services"]').forEach(function (c) { c.addEventListener('change', function () { setErr('services', form.querySelectorAll('[name="services"]:checked').length ? '' : 'Pick at least one service.'); }); });
  function recent() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]').filter(function (t) { return Date.now() - t < WINDOW; }); } catch (e) { return []; }
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var note = form.querySelector('.form-note');
    note.textContent = '';
    var d = new FormData(form);
    // bots: honeypot filled or instant submit — show success, send nothing
    if (d.get('website') || Date.now() - started < 3000) { form.classList.add('is-sent'); return; }
    if (recent().length >= LIMIT) { note.textContent = 'Too many enquiries from this device. Please try again later or email ' + TO + '.'; return; }

    var name = clean(d.get('name') || '', 80), phone = digits10(d.get('phone')), email = clean(d.get('email') || '', 254);
    var type = d.get('type') || '', msg = String(d.get('message') || '').replace(/\r/g, '').slice(0, 2000).trim();
    var services = d.getAll('services');
    var ok = true;
    ok = setErr('name', RULES.name(name)) && ok;
    ok = setErr('phone', RULES.phone(phone)) && ok;
    ok = setErr('email', RULES.email(email)) && ok;
    ok = setErr('type', RULES.type(type)) && ok;
    ok = setErr('services', services.length ? '' : 'Pick at least one service.') && ok;
    ok = setErr('message', RULES.message(msg)) && ok;
    if (!ok) { var first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }

    try { localStorage.setItem(KEY, JSON.stringify(recent().concat(Date.now()))); } catch (e) {}
    // Netlify Forms: post the fields as a regular form submission (the form is registered at deploy time via data-netlify).
    var fields = { 'form-name': 'enquiry', name: name, phone: '+91 ' + phone, email: email, type: type, services: services.join(', '), message: msg, website: '' };
    var encoded = Object.keys(fields).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(fields[k]); }).join('&');
    var btn = form.querySelector('.cf-submit'); if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: encoded })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); form.classList.add('is-sent'); })
      .catch(function () {
        // Forms endpoint unavailable (e.g. local preview): fall back to the visitor's email app, pre-filled.
        var body = ['Name: ' + name, 'Phone: +91 ' + phone, 'Email: ' + email, 'I am a: ' + type, 'Services: ' + services.join(', ')];
        if (msg) body.push('', msg);
        location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent('New enquiry from ' + name) + '&body=' + encodeURIComponent(body.join('\n'));
        form.classList.add('is-sent');
      })
      .then(function () { if (btn) { btn.disabled = false; btn.textContent = 'Send enquiry →'; } });
  });
})();
(function () {
  var nav = document.getElementById('nav'), burger = nav && nav.querySelector('.nav__burger');
  if (!burger) return;
  function setOpen(open) { nav.classList.toggle('open', open); document.documentElement.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  burger.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
  nav.querySelectorAll('ul a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  addEventListener('resize', function () { if (innerWidth > 740) setOpen(false); });
})();
