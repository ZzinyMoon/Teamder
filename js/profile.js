import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");

const user = JSON.parse(localStorage.getItem("user"));

if (!uid) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

const roleInput = document.getElementById("role");

const majorInput = document.getElementById("major");

const contactInput = document.getElementById("contact");

const skillsInput = document.getElementById("skills");

const introInput = document.getElementById("intro");

async function loadProfile() {
  const profileRef = doc(db, "profiles", uid);

  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    return;
  }

  const profile = profileSnap.data();

  if (roleInput) {
    roleInput.value = profile.role || "";
  }

  if (majorInput) {
    majorInput.value = profile.major || "";
  }

  if (contactInput) {
    contactInput.value = profile.contact || "";
  }

  if (skillsInput) {
    skillsInput.value = profile.skills || "";
  }

  if (introInput) {
    introInput.value = profile.intro || "";
  }
}

window.saveProfile = async function () {
  const role = roleInput.value;

  const major = majorInput.value;

  const contact = contactInput.value;

  const skills = skillsInput.value;

  const intro = introInput.value;

  if (!role || !major || !contact || !skills || !intro) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  const profile = {
    uid: uid,
    name: user ? user.name : "이름 없음",
    email: user ? user.email : "",
    role: role,
    selectedCategory: role,
    major: major,
    contact: contact,
    skills: skills,
    intro: intro,
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "profiles", uid), profile, { merge: true });

  localStorage.setItem(
    "profile",
    JSON.stringify({
      ...profile,
      updatedAt: new Date().toISOString(),
    }),
  );

  localStorage.setItem("role", role);
  localStorage.setItem("selectedCategory", role);

  alert("프로필이 저장되었습니다.");

  location.href = "mypage.html";
};

loadProfile();
