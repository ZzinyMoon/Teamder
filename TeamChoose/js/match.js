import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");

if (!uid) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

const selectedCategory = localStorage.getItem("selectedCategory");

const matchTitle = document.getElementById("matchTitle");

const matchSubtitle = document.getElementById("matchSubtitle");

const nameEl = document.getElementById("name");
const majorEl = document.getElementById("major");
const roleEl = document.getElementById("role");
const introEl = document.getElementById("intro");
const skillBox = document.getElementById("skillBox");
const imageEl = document.getElementById("profileImage");

let filteredMembers = [];
let currentIndex = 0;

if (selectedCategory) {
  matchTitle.textContent = selectedCategory + " 팀원 추천";

  matchSubtitle.textContent = selectedCategory + " 분야의 팀원을 추천합니다.";
}

async function loadMembers() {
  const querySnapshot = await getDocs(collection(db, "profiles"));

  const members = [];

  querySnapshot.forEach((docSnap) => {
    const profile = docSnap.data();

    if (profile.uid !== uid) {
      members.push({
        id: profile.uid,
        uid: profile.uid,
        name: profile.name || "이름 없음",
        major: profile.major || "학과 없음",
        role: profile.role || "역할 없음",
        selectedCategory: profile.selectedCategory || "",
        skills: profile.skills
          ? profile.skills.split(",").map((skill) => skill.trim())
          : [],
        intro: profile.intro || "자기소개가 없습니다.",
        image: profile.image || "",
      });
    }
  });

  filteredMembers = members.filter(
    (member) =>
      member.role === selectedCategory ||
      member.selectedCategory === selectedCategory,
  );

  if (filteredMembers.length === 0) {
    filteredMembers = members;

    matchSubtitle.textContent =
      "선택한 분야의 팀원이 없어 전체 팀원을 추천합니다.";
  }

  if (filteredMembers.length === 0) {
    showEmpty();
    return;
  }

  showMember();
}

function showEmpty() {
  nameEl.textContent = "추천할 팀원이 없습니다.";
  majorEl.textContent = "";
  roleEl.textContent = "";
  introEl.textContent = "다른 사용자가 프로필을 만들면 이곳에 표시됩니다.";
  skillBox.innerHTML = "";
  imageEl.innerHTML = "Profile";
}

function showMember() {
  const member = filteredMembers[currentIndex];

  nameEl.textContent = member.name;

  majorEl.textContent = member.major;

  roleEl.textContent = member.role;

  introEl.textContent = member.intro;

  if (member.image) {
    imageEl.innerHTML = `
            <img
                src="${member.image}"
                alt="${member.name}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    border-radius:50%;
                "
            >
        `;
  } else {
    imageEl.innerHTML = "Profile";
  }

  skillBox.innerHTML = "";

  member.skills.forEach((skill) => {
    skillBox.innerHTML += `
            <div class="skill">
                ${skill}
            </div>
        `;
  });
}

function nextMember() {
  if (filteredMembers.length === 0) return;

  currentIndex++;

  if (currentIndex >= filteredMembers.length) {
    alert("추천할 팀원을 모두 확인했습니다.");
    currentIndex = 0;
  }

  showMember();
}

window.passMember = function () {
  nextMember();
};

window.likeMember = async function () {
  const currentMember = filteredMembers[currentIndex];

  if (!currentMember) return;

  await setDoc(doc(db, "users", uid, "likes", currentMember.uid), {
    ...currentMember,
    likedAt: serverTimestamp(),
  });

  alert("좋아요 저장 완료");

  nextMember();
};

window.openMember = function () {
  const member = filteredMembers[currentIndex];

  if (!member) return;

  localStorage.setItem("selectedMember", JSON.stringify(member));

  location.href = "member.html";
};

loadMembers();
