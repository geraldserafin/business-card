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
  runaway.style.transform = "";
  document.activeElement?.blur();
  if (key === "reason") $("why-label").textContent = WHY[value("invite")];
  steps[i].querySelector("input[type=text],textarea")?.focus({ preventScroll: true });
}

function go() {
  if (next.disabled) return;
  if (i === last) return send();
  show(i + 1);
}

back.addEventListener("click", () => show(i - 1));
next.addEventListener("click", go);

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

// Uciekająca opcja „Raczej nie”: szybko zjeżdża w dół, w zarezerwowane pod nią
// miejsce (nic nie zasłania), po kilku unikach się poddaje. Mysz i dotyk;
// klawiatura działa od razu.
const MAX_DODGES = 3;
const STEP = 56; // px na jeden unik; miejsce pod listą w CSS: .runs
const LINES = ["Ej!", "Za wolny/a 😏", "Ostatni raz…"];
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const runaway = form.querySelector('input[value="Nie"]').closest(".opt");
let dodges = 0;
if (!calm) {
  runaway.parentElement.classList.add("runs");
  runaway.classList.add("fleeing");
}

function dodge() {
  dodges++;
  runaway.style.transform = `translateY(${dodges * STEP}px)`;
  if (dodges === MAX_DODGES) runaway.classList.remove("fleeing");
  note.textContent = dodges === MAX_DODGES ? "Dobra, poddaję się. Klikaj 🙂" : LINES[dodges - 1];
}

const canDodge = () => !calm && dodges < MAX_DODGES;
runaway.addEventListener("pointerenter", (e) => {
  if (e.pointerType === "mouse" && canDodge()) dodge();
});
runaway.addEventListener("pointerdown", (e) => {
  suppressClick = false;
  if (!canDodge()) return;
  e.preventDefault(); // bez fokusu i podświetlenia na uciekającej opcji
  suppressClick = true;
  dodge();
});
runaway.addEventListener("click", (e) => {
  if (suppressClick) { e.preventDefault(); suppressClick = false; }
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
    note.textContent = "Nie udało się wysłać. Spróbuj jeszcze raz albo napisz na serafingerald@protonmail.com.";
  }
}

show(0);
