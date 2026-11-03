const GOOGLE = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLSfaxbnWz5lhL5r1CINtmmUuqSi3MhVnPxfcRvMDKtv-t75ssw/formResponse",
  entries: {
    role: "entry.1268573250",
    impression: "entry.1866654055",
    invite: "entry.1698486123",
    reason: "entry.2011078181",
    name: "entry.1292785363",
    company: "entry.4184496",
    contact: "entry.982384582",
  },
};

const WHY = {
  "Tak": "Co cię przekonało?",
  "Może, ale czegoś mi brakuje": "Co musiałoby się zmienić, żebyś odpowiedział(a) „tak”?",
  "Nie": "Czego zabrakło albo co cię zniechęciło?",
};

// Wersja ogólna linkuje tu z ?v=general, żeby przycisk CV dawał właściwe CV.
if (new URLSearchParams(location.search).get("v") === "general") {
  for (const id of ["cv", "cv2"]) {
    document.getElementById(id).href = "../cv/Gerald_Serafin_CV_General_PL.pdf";
  }
}

const $ = (id) => document.getElementById(id);
const form = $("form");
const steps = [...form.querySelectorAll(".step")];
const next = $("next"), back = $("back"), note = $("note");
const last = steps.length - 1;
let i = 0;
let suppressClick = false;

const value = (name) => new FormData(form).get(name);

function show(n) {
  i = n;
  steps.forEach((s, k) => (s.hidden = k !== i));
  $("bar").style.width = `${(i / (last + 1)) * 100}%`;
  back.hidden = i === 0;
  const key = steps[i].dataset.key;
  next.textContent = i === 0 ? "Zaczynamy" : i === last ? "Wyślij" : "Dalej";
  next.disabled = steps[i].hasAttribute("data-required") && !value(key);
  note.textContent = "";
  if (key === "reason") $("why-label").textContent = WHY[value("invite")];
  steps[i].querySelector("input[type=text],textarea")?.focus({ preventScroll: true });
}

function go() {
  if (next.disabled) return;
  if (i === last) return send();
  show(i + 1);
}

back.addEventListener("click", () => show(i - 1));
next.addEventListener("click", (e) => {
  if (suppressClick) { e.preventDefault(); suppressClick = false; return; }
  go();
});

form.addEventListener("change", (e) => {
  const key = steps[i].dataset.key;
  if (e.target.name !== key) return;
  next.disabled = false;
  // wybór z listy od razu przechodzi dalej
  if (e.target.type === "radio") setTimeout(() => steps[i].dataset.key === key && show(i + 1), 220);
});

form.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type === "text") {
    e.preventDefault();
    go();
  }
});
form.addEventListener("submit", (e) => e.preventDefault());

// Uciekający przycisk „Wyślij”: kilka uników, potem się poddaje. Mysz i dotyk;
// klawiatura (Enter/Spacja) zawsze wysyła od razu.
const MAX_DODGES = 3;
const LINES = ["Ej!", "Za wolny/a 😏", "Ostatni raz…"];
let dodges = 0;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (a, b) => a + Math.random() * (b - a);

// Skok o min–max px w stronę, w którą jest więcej miejsca (lo <= 0 <= hi).
function jump(lo, hi, min, max) {
  const dir = hi >= -lo ? 1 : -1;
  const room = dir > 0 ? hi : -lo;
  return dir * Math.min(room, rand(min, max));
}

function dodge() {
  next.style.transform = "none";
  const r = next.getBoundingClientRect();
  const m = 12;
  const dx = jump(m - r.left, innerWidth - r.right - m, 60, 160);
  const dy = jump(Math.max(70 - r.top, -120), Math.min(innerHeight - r.bottom - m, 120), 40, 100);
  next.style.transform = `translate(${dx}px, ${dy}px)`;
  note.textContent = LINES[dodges];
  dodges++;
  if (dodges === MAX_DODGES) note.textContent = "Dobra, poddaję się. Klikaj 🙂";
}

const canDodge = () => !calm && i === last && dodges < MAX_DODGES;
next.addEventListener("pointerenter", (e) => {
  if (e.pointerType === "mouse" && canDodge()) dodge();
});
next.addEventListener("pointerdown", (e) => {
  suppressClick = false;
  if (e.pointerType === "mouse" || !canDodge()) return;
  suppressClick = true;
  dodge();
});

async function send() {
  const data = new FormData();
  const fd = new FormData(form);
  for (const [key, entry] of Object.entries(GOOGLE.entries)) {
    const v = fd.get(key);
    if (!v) continue;
    if (key === "role" && v === "Inne") {
      // „Inne” w Google Forms to osobna opcja z polem tekstowym
      data.append(entry, "__other_option__");
      data.append(`${entry}.other_option_response`, v);
    } else {
      data.append(entry, v);
    }
  }
  next.disabled = true;
  try {
    await fetch(GOOGLE.action, { method: "POST", mode: "no-cors", body: data });
    form.hidden = true;
    $("bar").style.width = "100%";
    $("done").hidden = false;
  } catch {
    next.disabled = false;
    next.style.transform = "none";
    note.textContent = "Nie udało się wysłać. Spróbuj jeszcze raz albo napisz na serafingerald@protonmail.com.";
  }
}

show(0);
