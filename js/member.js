import { db } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");

if (!uid) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

const member = JSON.parse(localStorage.getItem("selectedMember"));

if (!member) {
  alert("선택된 팀원 정보가 없습니다.");
  location.href = "match.html";
}

document.getElementById("memberName").textContent = member.name;
document.getElementById("memberMajor").textContent = member.major;
document.getElementById("memberRole").textContent = member.role;
document.getElementById("memberIntro").textContent = member.intro;

const skillBox = document.getElementById("skillBox");
skillBox.innerHTML = "";

member.skills.forEach((skill) => {
  skillBox.innerHTML += `
        <div class="skill">${skill}</div>
    `;
});

const profileImage = document.getElementById("profileImage");

if (member.image) {
  profileImage.innerHTML = `
        <img
            src="${member.image}"
            alt="${member.name}"
            style="
                width:100%;
                height:100%;
                object-fit:cover;
                border-radius:50%;
            ">
    `;
} else {
  profileImage.innerHTML = "Profile";
}

window.likeMember = async function () {
  await setDoc(doc(db, "users", uid, "likes", member.uid), {
    ...member,
    likedAt: serverTimestamp(),
  });

  alert("좋아요에 추가되었습니다.");
};

window.requestMatchFromDetail = async function () {
  const myProfileSnap = await getDoc(doc(db, "profiles", uid));

  const targetProfileSnap = await getDoc(doc(db, "profiles", member.uid));

  if (!myProfileSnap.exists()) {
    alert("내 프로필을 먼저 작성해주세요.");
    location.href = "profile.html";
    return;
  }

  if (!targetProfileSnap.exists()) {
    alert("상대 프로필 정보를 찾을 수 없습니다.");
    return;
  }

  const myProfile = myProfileSnap.data();
  const targetProfile = targetProfileSnap.data();

  await addDoc(collection(db, "matchRequests"), {
    fromUid: uid,
    fromName: myProfile.name,
    fromRole: myProfile.role,
    fromContact: myProfile.contact,

    toUid: member.uid,
    toName: targetProfile.name,
    toRole: targetProfile.role,
    toContact: targetProfile.contact,

    status: "pending",
    createdAt: serverTimestamp(),
  });

  alert("매칭 요청을 보냈습니다.");
};
