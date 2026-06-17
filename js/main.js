import { db } from "./firebase.js";

import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const menu = document.getElementById("menu");
const studentButtons = document.getElementById("studentButtons");
const studentRight = document.getElementById("studentRight");

const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn) {
  menu.innerHTML = `
    <a href="match.html">팀원 찾기</a>
    <a href="mypage.html">마이페이지</a>
    <a href="#" onclick="logout()">로그아웃</a>
  `;

  studentButtons.innerHTML = `
    <div class="guest-buttons">
      <a href="match.html" class="primary-btn">
        팀원 찾기
      </a>

      <a href="mypage.html" class="secondary-btn">
        마이페이지
      </a>
    </div>
  `;

  loadStudentCard();
} else {
  menu.innerHTML = `
    <a href="login.html">로그인</a>
    <a href="signup.html">회원가입</a>
  `;

  studentButtons.innerHTML = `
    <div class="guest-buttons">
      <a href="login.html" class="primary-btn">
        로그인
      </a>

      <a href="signup.html" class="secondary-btn">
        회원가입
      </a>
    </div>
  `;

  studentRight.innerHTML = `
    <div class="student-card guest-card">
      <h2>Teamder 시작하기</h2>

      <p>
        로그인 후<br>
        팀원 추천과 매칭 기능을 사용할 수 있습니다.
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

async function loadStudentCard() {
  const uid = localStorage.getItem("uid");

  if (!uid) return;

  try {
    const profileRef = doc(db, "profiles", uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      studentRight.innerHTML = `
        <div class="student-card">
          <h2>프로필을 등록하세요</h2>

          <p>
            프로필을 작성하면<br>
            다른 팀원들과 매칭할 수 있습니다.
          </p>

          <a href="profile.html" class="primary-btn">
            프로필 작성하기
          </a>
        </div>
      `;
      return;
    }

    const profile = profileSnap.data();

    const skills = profile.skills ? profile.skills.split(",") : [];

    studentRight.innerHTML = `
      <div class="student-card">
        <div class="profile-image">
          ${(profile.name || "T").charAt(0)}
        </div>

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
