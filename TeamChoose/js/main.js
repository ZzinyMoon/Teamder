import { db } from "./firebase.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const menu = document.getElementById("menu");
const heroButtons = document.getElementById("heroButtons");
const heroRight = document.getElementById("heroRight");

const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn) {
  menu.innerHTML = `
    <a href="match.html">탐색</a>
    <a href="#" onclick="logout()">로그아웃</a>
  `;

  heroButtons.innerHTML = `
    <a href="match.html">
      <button class="primary-btn">
        팀원 찾기
      </button>
    </a>
  `;

  loadHeroCard();
} else {
  menu.innerHTML = `
    <a href="login.html">로그인</a>
    <a href="signup.html">회원가입</a>
  `;

  heroRight.innerHTML = `
    <div class="hero-card guest-card">
      <h2>Teamder 시작하기</h2>

      <p>
        로그인하고<br>
        나와 가장 잘 맞는 팀원을 찾아보세요.
      </p>

      <div class="guest-buttons">
        <a href="login.html" class="primary-btn">
          로그인
        </a>

        <a href="signup.html" class="secondary-btn">
          회원가입
        </a>
      </div>
    </div>
  `;
}

window.logout = function () {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("uid");
  localStorage.removeItem("user");

  location.reload();
};

async function loadHeroCard() {
  const uid = localStorage.getItem("uid");

  if (!uid) return;

  try {
    const profileRef = doc(db, "profiles", uid);

    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) return;

    const profile = profileSnap.data();

    const skills = profile.skills ? profile.skills.split(",") : [];

    heroRight.innerHTML = `
      <div class="hero-card">
        <h2>${profile.name || "이름 없음"}</h2>

        <p>${profile.role || "역할 미설정"}</p>

        <div class="skill-box">
          ${skills
            .map((skill) => `<div class="skill">${skill.trim()}</div>`)
            .join("")}
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
  }
}
