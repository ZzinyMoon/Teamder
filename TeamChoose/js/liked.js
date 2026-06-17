import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");
const likedList = document.getElementById("likedList");

if (!uid) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

async function renderLikedMembers() {
  likedList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "users", uid, "likes"));

  if (snapshot.empty) {
    likedList.innerHTML = `
            <div class="card">
                좋아요한 팀원이 없습니다.
            </div>
        `;
    return;
  }

  snapshot.forEach((docSnap) => {
    const member = docSnap.data();

    likedList.innerHTML += `
            <div class="card">

                <h3>${member.name}</h3>

                <p>${member.major}</p>

                <p>${member.role}</p>

                <div class="skill-box">
                    ${
                      member.skills
                        ? member.skills
                            .map(
                              (skill) => `
                            <div class="skill">${skill}</div>
                        `,
                            )
                            .join("")
                        : ""
                    }
                </div>

                <button
                    class="primary-btn"
                    onclick="requestMatch('${member.uid}')">
                    매칭 요청
                </button>

                <br><br>

                <button
                    class="secondary-btn"
                    onclick="removeLike('${member.uid}')">
                    좋아요 취소
                </button>

            </div>
        `;
  });
}

window.requestMatch = async function (targetUid) {
  const myProfileSnap = await getDoc(doc(db, "profiles", uid));

  const targetProfileSnap = await getDoc(doc(db, "profiles", targetUid));

  if (!myProfileSnap.exists()) {
    alert("내 프로필을 먼저 작성해주세요.");
    location.href = "profile.html";
    return;
  }

  if (!targetProfileSnap.exists()) {
    alert("상대 프로필을 찾을 수 없습니다.");
    return;
  }

  const myProfile = myProfileSnap.data();
  const targetProfile = targetProfileSnap.data();

  await addDoc(collection(db, "matchRequests"), {
    fromUid: uid,
    fromName: myProfile.name,
    fromRole: myProfile.role,
    fromContact: myProfile.contact,

    toUid: targetUid,
    toName: targetProfile.name,
    toRole: targetProfile.role,
    toContact: targetProfile.contact,

    status: "pending",
    createdAt: serverTimestamp(),
  });

  alert("매칭 요청을 보냈습니다.");
};

window.removeLike = async function (targetUid) {
  await deleteDoc(doc(db, "users", uid, "likes", targetUid));

  alert("좋아요가 취소되었습니다.");

  renderLikedMembers();
};

renderLikedMembers();
