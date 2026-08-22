(function () {
  "use strict";

  // TODO: replace with your real values from Supabase → Project Settings → API.
  // These are safe to be public (the anon key is designed to be embedded in client code).
  const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
  const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

  if (SUPABASE_URL.indexOf("YOUR_SUPABASE") === 0) {
    console.warn(
      "Charlas: Supabase is not configured yet. Fill in SUPABASE_URL and SUPABASE_ANON_KEY in assets/js/charlas.js."
    );
    return;
  }

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const lockedEl = document.getElementById("charlas-locked");
  const unlockedEl = document.getElementById("charlas-unlocked");
  const form = document.getElementById("contact-form");
  const emailInput = document.getElementById("charlas-email");
  const statusEl = document.getElementById("charlas-status");
  const listEl = document.getElementById("charlas-list");
  const emptyEl = document.getElementById("charlas-empty");
  const logoutLink = document.getElementById("charlas-logout");

  function showLocked() {
    lockedEl.style.display = "";
    unlockedEl.style.display = "none";
  }

  function showUnlocked() {
    lockedEl.style.display = "none";
    unlockedEl.style.display = "";
  }

  function renderCharla(charla) {
    const card = document.createElement("div");
    card.className = "valor-block is-visible";

    const title = document.createElement("h4");
    title.textContent = charla.title;
    card.appendChild(title);

    if (charla.description) {
      const desc = document.createElement("p");
      desc.textContent = charla.description;
      card.appendChild(desc);
    }

    if (charla.video_url) {
      const link = document.createElement("a");
      link.className = "cta-elegant";
      link.href = charla.video_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Ver charla";
      card.appendChild(link);
    }

    return card;
  }

  async function loadCharlas() {
    listEl.innerHTML = "";
    emptyEl.style.display = "none";

    const { data, error } = await supabase
      .from("charlas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Charlas: failed to load talks", error);
      return;
    }

    if (!data || data.length === 0) {
      emptyEl.style.display = "";
      return;
    }

    data.forEach(function (charla) {
      listEl.appendChild(renderCharla(charla));
    });
  }

  async function refreshFromSession() {
    const { data } = await supabase.auth.getSession();
    if (data && data.session) {
      showUnlocked();
      loadCharlas();
    } else {
      showLocked();
    }
  }

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = emailInput.value.trim();
      if (!email) {
        return;
      }

      statusEl.textContent = "Enviando enlace...";

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: { emailRedirectTo: window.location.href.split("#")[0] },
      });

      if (error) {
        statusEl.textContent = "Ocurrió un error. Inténtalo nuevamente.";
        console.error("Charlas: signInWithOtp failed", error);
        return;
      }

      statusEl.textContent = "Revisa tu correo: te enviamos un enlace de acceso.";
      form.reset();
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", async function (event) {
      event.preventDefault();
      await supabase.auth.signOut();
      showLocked();
    });
  }

  supabase.auth.onAuthStateChange(function (_event, session) {
    if (session) {
      showUnlocked();
      loadCharlas();
    } else {
      showLocked();
    }
  });

  refreshFromSession();
})();
