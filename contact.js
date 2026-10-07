// Contact form + scroll reveals shared by all three concept contact pages.
// No backend yet: a valid enquiry opens the visitor's email app, pre-filled,
// addressed to connect@atlanticmedia.in.
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

    var name = clean(d.get('name') || '', 80), phone = clean(d.get('phone') || '', 15), email = clean(d.get('email') || '', 254);
    var type = d.get('type') || '', msg = String(d.get('message') || '').replace(/\r/g, '').slice(0, 2000).trim();
    var services = d.getAll('services');
    var bad = /<\s*\/?\s*[a-z!]|javascript:|https?:\/\/|www\./i;
    var ok = true;
    ok = setErr('name', !name ? 'Please enter your name.' : /^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,79}$/u.test(name) ? '' : 'Use letters only.') && ok;
    ok = setErr('phone', /^[0-9][0-9 -]{6,14}$/.test(phone) ? '' : 'Enter a valid phone number.') && ok;
    ok = setErr('email', /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,185}\.[A-Za-z]{2,24}$/.test(email) ? '' : 'Enter a valid email address.') && ok;
    ok = setErr('type', ['Brand', 'Creator', 'Agency', 'Job applicant', 'Other'].indexOf(type) >= 0 ? '' : 'Please choose one.') && ok;
    ok = setErr('services', services.length ? '' : 'Pick at least one service.') && ok;
    ok = setErr('message', bad.test(msg) ? 'Please don’t include links or code.' : '') && ok;
    if (!ok) { var first = form.querySelector('[aria-invalid="true"]'); if (first) first.focus(); return; }

    try { localStorage.setItem(KEY, JSON.stringify(recent().concat(Date.now()))); } catch (e) {}
    var body = ['Name: ' + name, 'Phone: +91 ' + phone, 'Email: ' + email, 'I am a: ' + type, 'Services: ' + services.join(', ')];
    if (msg) body.push('', msg);
    location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent('New enquiry from ' + name) + '&body=' + encodeURIComponent(body.join('\n'));
    form.classList.add('is-sent');
  });
})();
