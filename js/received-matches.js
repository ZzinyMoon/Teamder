import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");
const requestList = document.getElementById("requestList");

if (!uid) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

async function loadReceivedRequests() {
  requestList.innerHTML = "";

  const q = query(collection(db, "matchRequests"), where("toUid", "==", uid));

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    requestList.innerHTML = `
            <div class="card">
                받은 매칭 요청이 없습니다.
            </div>
        `;
    return;
  }

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    requestList.innerHTML += `
            <div class="card">

                <h3>${data.fromName}</h3>

                <p>${data.fromRole || "역할 정보 없음"}</p>

                <p>상태 : ${getStatusText(data.status)}</p>

                ${
                  data.status === "pending"
                    ? `
                        <br>

                        <button
                            class="primary-btn"
                            onclick="acceptRequest('${docSnap.id}')">
                            수락
                        </button>

                        <br><br>

                        <button
                            class="secondary-btn"
                            onclick="rejectRequest('${docSnap.id}')">
                            거절
                        </button>
                    `
                    : ""
                }

                ${
                  data.status === "accepted"
                    ? `
                        <br>
                        <div class="card">
                            <h3>연락처</h3>
                            <p>${data.fromContact || "연락처 없음"}</p>
                        </div>
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

window.acceptRequest = async function (requestId) {
  await updateDoc(doc(db, "matchRequests", requestId), {
    status: "accepted",
  });

  alert("매칭 요청을 수락했습니다.");

  loadReceivedRequests();
};

window.rejectRequest = async function (requestId) {
  await updateDoc(doc(db, "matchRequests", requestId), {
    status: "rejected",
  });

  alert("매칭 요청을 거절했습니다.");

  loadReceivedRequests();
};

loadReceivedRequests();
