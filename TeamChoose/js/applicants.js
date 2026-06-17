import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");

const projectId = localStorage.getItem("selectedProject");

const applicantList = document.getElementById("applicantList");

if (!uid) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

if (!projectId) {
  applicantList.innerHTML = `
    <div class="card">
      선택된 프로젝트가 없습니다.
    </div>
  `;
} else {
  loadApplicants();
}

async function loadApplicants() {
  applicantList.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "projects", projectId, "applicants"),
  );

  if (snapshot.empty) {
    applicantList.innerHTML = `
      <div class="card">
        아직 지원자가 없습니다.
      </div>
    `;
    return;
  }

  snapshot.forEach((docSnap) => {
    const applicant = docSnap.data();

    applicantList.innerHTML += `
      <div class="card">

        <h3>${applicant.name}</h3>

        <p>
          역할 : ${applicant.role || "정보 없음"}
        </p>

        <p>
          학과 : ${applicant.major || "정보 없음"}
        </p>

        <p>
          연락처 :
          ${
            applicant.status === "채용완료"
              ? applicant.contact || "정보 없음"
              : "***********"
          }
        </p>

        <p>
          상태 : ${applicant.status || "지원완료"}
        </p>

        ${
          applicant.status === "지원완료"
            ? `
              <div style="display:flex; gap:10px; margin-top:12px;">
                
                <button
                  class="primary-btn"
                  onclick="hireApplicant('${docSnap.id}')">
                  채용하기
                </button>

                <button
                  class="danger-btn"
                  onclick="rejectApplicant('${docSnap.id}')">
                  거절하기
                </button>

              </div>
            `
            : applicant.status === "채용완료"
              ? `
              <button
                class="secondary-btn"
                disabled>
                채용완료
              </button>
            `
              : `
              <button
                class="danger-btn"
                disabled>
                거절됨
              </button>
            `
        }

      </div>
    `;
  });
}

window.hireApplicant = async function (applicantUid) {
  const check = confirm("이 지원자를 채용하시겠습니까?");

  if (!check) return;

  try {
    await updateDoc(
      doc(db, "projects", projectId, "applicants", applicantUid),
      {
        status: "채용완료",
      },
    );

    alert("채용이 완료되었습니다.");

    loadApplicants();
  } catch (error) {
    console.error(error);

    alert("채용 실패 : " + error.message);
  }
};

window.rejectApplicant = async function (applicantUid) {
  const check = confirm("이 지원자를 거절하시겠습니까?");

  if (!check) return;

  try {
    await updateDoc(
      doc(db, "projects", projectId, "applicants", applicantUid),
      {
        status: "거절됨",
      },
    );

    alert("지원자가 거절되었습니다.");

    loadApplicants();
  } catch (error) {
    console.error(error);

    alert("거절 실패 : " + error.message);
  }
};
