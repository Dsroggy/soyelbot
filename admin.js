import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore, collection, addDoc, setDoc, doc, getDocs
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

/* 🔐 LOGIN — FINAL GUARANTEED FIX */
window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorBox = document.getElementById("error");

  if (!btn) {
    console.error("Login button not found");
    return;
  }

  btn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      errorBox.innerText = "Email aur password dono bharo";
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "dashboard.html";
      })
      .catch(err => {
        errorBox.innerText = err.message;
      });
  });
});

/* CMS FEATURES — UNCHANGED */
window.addPage = async () => {
  await addDoc(collection(db,"pages"),{
    title:pageTitle.value,
    content:pageContent.value,
    created:new Date()
  });
  pageStatus.innerText="✅ Page added";
};

window.addVideo = async () => {
  await addDoc(collection(db,"videos"),{
    title:videoTitle.value,
    url:videoURL.value
  });
  videoStatus.innerText="🎥 Video added";
};

window.saveText = async () => {
  await setDoc(doc(db,"siteContent","homepage"),{
    title:homeTitle.value,
    subtitle:homeSub.value
  });
  textStatus.innerText="📝 Updated";
};

window.searchData = async () => {
  const q = searchInput.value.toLowerCase();
  const snap = await getDocs(collection(db,"pages"));
  let res="";
  snap.forEach(d=>{
    if(d.data().title.toLowerCase().includes(q))
      res+=JSON.stringify(d.data(),null,2)+"\n";
  });
  searchResult.innerText=res||"No result";
};
