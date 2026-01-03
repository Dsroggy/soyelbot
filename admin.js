import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 FIREBASE CONFIG — UNCHANGED */
const firebaseConfig = {
  apiKey: "AIzaSyCWpp-y0OQ0RfT3ghf5zCnZGWgIzhUbudU",
  authDomain: "dsr-super-admin.firebaseapp.com",
  projectId: "dsr-super-admin",
  appId: "1:494683172524:web:c7d40a4456d574fc187909"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= LOGIN ================= */
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorBox = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      errorBox.innerText = "Email aur password dono bharo";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 🔥 WAIT COMPLETE → THEN REDIRECT
      window.location.replace("dashboard.html");
    } catch (err) {
      errorBox.innerText = err.message;
    }
  });
});

/* ================= DASHBOARD AUTH (FIXED) ================= */
window.checkAuth = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // ✅ allow dashboard
      console.log("Dashboard access:", user.email);
    } else {
      // ❌ only redirect if REALLY not logged in
      window.location.replace("index.html");
    }
  });
};

/* ================= LOGOUT ================= */
window.logout = () => {
  signOut(auth).then(() => {
    window.location.replace("index.html");
  });
};

/* ================= UI ================= */
window.showSection = id => {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

/* ================= CMS ================= */
window.addPage = async () => {
  await addDoc(collection(db, "pages"), {
    title: pageTitle.value,
    content: pageContent.value,
    created: new Date()
  });
  pageStatus.innerText = "Page saved";
};

window.addVideo = async () => {
  await addDoc(collection(db, "videos"), {
    title: videoTitle.value,
    url: videoURL.value
  });
  videoStatus.innerText = "Video saved";
};
