import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");

const projectId = localStorage.getItem("selectedProject");

const VolunteerList = document.getElementById("VolunteerList");

if (!uid) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

if (!projectId) {
  VolunteerList.innerHTML = `
    <div class="card">
      선택된 프로젝트가 없습니다.
    </div>
  `;
} else {
  loadVolunteers();
}

async function loadVolunteers() {
  VolunteerList.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "projects", projectId, "volunteers"),
  );

  if (snapshot.empty) {
    VolunteerList.innerHTML = `
      <div class="card">
        아직 지원자가 없습니다.
      </div>
    `;
    return;
  }

  snapshot.forEach((docSnap) => {
    const Volunteer = docSnap.data();

    VolunteerList.innerHTML += `
      <div class="card">

        <h3>${Volunteer.name}</h3>

        <p>
          역할 : ${Volunteer.role || "정보 없음"}
        </p>

        <p>
          학과 : ${Volunteer.major || "정보 없음"}
        </p>

        <p>
          연락처 :
          ${
            Volunteer.status === "채용완료"
              ? Volunteer.contact || "정보 없음"
              : "***********"
          }
        </p>

        <p>
          상태 : ${Volunteer.status || "지원완료"}
        </p>

        ${
          Volunteer.status === "지원완료"
            ? `
              <div style="display:flex; gap:10px; margin-top:12px;">
                
                <button
                  class="primary-btn"
                  onclick="hireVolunteer('${docSnap.id}')">
                  채용하기
                </button>

                <button
                  class="danger-btn"
                  onclick="rejectVolunteer('${docSnap.id}')">
                  거절하기
                </button>

              </div>
            `
            : Volunteer.status === "채용완료"
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

window.hireVolunteer = async function (VolunteerUid) {
  const check = confirm("이 지원자를 채용하시겠습니까?");

  if (!check) return;

  try {
    await updateDoc(
      doc(db, "projects", projectId, "volunteers", VolunteerUid),
      {
        status: "채용완료",
      },
    );

    alert("채용이 완료되었습니다.");

    loadVolunteers();
  } catch (error) {
    console.error(error);

    alert("채용 실패 : " + error.message);
  }
};

window.rejectVolunteer = async function (VolunteerUid) {
  const check = confirm("이 지원자를 거절하시겠습니까?");

  if (!check) return;

  try {
    await updateDoc(
      doc(db, "projects", projectId, "Volunteers", VolunteerUid),
      {
        status: "거절됨",
      },
    );

    alert("지원자가 거절되었습니다.");

    loadVolunteers();
  } catch (error) {
    console.error(error);

    alert("거절 실패 : " + error.message);
  }
};
