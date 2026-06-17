import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");
const matchList = document.getElementById("matchList");

if (!uid) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

async function loadSentRequests() {
  matchList.innerHTML = "";

  const q = query(collection(db, "matchRequests"), where("fromUid", "==", uid));

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    matchList.innerHTML = `
            <div class="card">
                보낸 매칭 요청이 없습니다.
            </div>
        `;
    return;
  }

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    matchList.innerHTML += `
            <div class="card">

                <h3>${data.toName}</h3>

                <p>${data.toRole || "역할 정보 없음"}</p>

                <p>상태 : ${getStatusText(data.status)}</p>

                ${
                  data.status === "accepted"
                    ? `
                        <br>
                        <div class="card">
                            <h3>연락처</h3>
                            <p>${data.toContact || "연락처 없음"}</p>
                        </div>
                    `
                    : ""
                }

                ${
                  data.status === "pending"
                    ? `
                        <br>
                        <button
                            class="secondary-btn"
                            onclick="cancelRequest('${docSnap.id}')">
                            요청 취소
                        </button>
                    `
                    : ""
                }

            </div>
        `;
  });
}

function getStatusText(status) {
  if (status === "pending") return "대기중";
  if (status === "accepted") return "수락됨";
  if (status === "rejected") return "거절됨";
  return status;
}

window.cancelRequest = async function (requestId) {
  await deleteDoc(doc(db, "matchRequests", requestId));

  alert("매칭 요청이 취소되었습니다.");

  loadSentRequests();
};

loadSentRequests();
