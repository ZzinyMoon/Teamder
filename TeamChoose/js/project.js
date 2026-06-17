import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const uid = localStorage.getItem("uid");

const user = JSON.parse(localStorage.getItem("user"));

const projectList = document.getElementById("projectList");

const projectDetail = document.getElementById("projectDetail");

if (!uid) {
  alert("로그인이 필요합니다.");
  location.href = "login.html";
}

/* 프로젝트 작성 */
window.saveProject = async function () {
  const title = document.getElementById("title").value;

  const role = document.getElementById("role").value;

  const desc = document.getElementById("desc").value;

  if (!title || !role || !desc) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  try {
    await addDoc(collection(db, "projects"), {
      title,
      role,
      desc,
      author: user ? user.name : "익명",
      authorUid: uid,
      createdAt: serverTimestamp(),
    });

    alert("프로젝트가 등록되었습니다.");

    location.href = "projects.html";
  } catch (error) {
    console.error(error);
    alert("프로젝트 등록 실패 : " + error.message);
  }
};

/* 프로젝트 목록 */
async function renderProjects() {
  if (!projectList) return;

  projectList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "projects"));

  if (snapshot.empty) {
    projectList.innerHTML = `
            <div class="card">
                등록된 프로젝트가 없습니다.
            </div>
        `;
    return;
  }

  snapshot.forEach((docSnap) => {
    const project = docSnap.data();

    const projectId = docSnap.id;

    projectList.innerHTML += `
            <div class="project-card">

                <div onclick="openProject('${projectId}')">

                    <div class="project-title">
                        ${project.title}
                    </div>

                    <div class="project-role">
                        모집 역할 : ${project.role}
                    </div>

                    <div class="project-desc">
                        작성자 : ${project.author}
                    </div>

                    <br>

                    <div class="project-desc">
                        ${project.desc}
                    </div>

                </div>

                ${
                  project.authorUid === uid
                    ? `
                        <br>

                        <button
                            class="secondary-btn"
                            onclick="deleteProject('${projectId}')">
                            삭제
                        </button>
                    `
                    : ""
                }

            </div>
        `;
  });
}

window.openProject = function (id) {
  localStorage.setItem("selectedProject", id);

  location.href = "project.html";
};

window.deleteProject = async function (id) {
  const check = confirm("프로젝트를 삭제하시겠습니까?");

  if (!check) return;

  try {
    await deleteDoc(doc(db, "projects", id));

    alert("프로젝트가 삭제되었습니다.");

    renderProjects();
  } catch (error) {
    console.error(error);
    alert("삭제 실패 : " + error.message);
  }
};

/* 프로젝트 상세 */
async function renderProjectDetail() {
  if (!projectDetail) return;

  const projectId = localStorage.getItem("selectedProject");

  if (!projectId) {
    projectDetail.innerHTML = `
            <div class="card">
                선택된 프로젝트가 없습니다.
            </div>
        `;
    return;
  }

  const projectSnap = await getDoc(doc(db, "projects", projectId));

  if (!projectSnap.exists()) {
    projectDetail.innerHTML = `
            <div class="card">
                프로젝트를 찾을 수 없습니다.
            </div>
        `;
    return;
  }

  const project = projectSnap.data();

  projectDetail.innerHTML = `
        <div class="card">

            <h1>
                ${project.title}
            </h1>

            <br>

            <h3>
                모집 역할
            </h3>

            <p>
                ${project.role}
            </p>

            <br>

            <h3>
                작성자
            </h3>

            <p>
                ${project.author}
            </p>

            <br>

            <h3>
                프로젝트 설명
            </h3>

            <p>
                ${project.desc}
            </p>

            <br>

            ${
              project.authorUid === uid
                ? `
                    <button
                        class="primary-btn"
                        onclick="viewApplicants()">
                        지원자 보기
                    </button>
                `
                : `
                    <button
                        class="primary-btn"
                        onclick="applyProject('${projectId}')">
                        지원하기
                    </button>
                `
            }

        </div>
    `;
}

/* 프로젝트 지원 */
window.applyProject = async function (projectId) {
  try {
    const profileSnap = await getDoc(doc(db, "profiles", uid));

    if (!profileSnap.exists()) {
      alert("프로필을 먼저 작성해주세요.");
      location.href = "profile.html";
      return;
    }

    const profile = profileSnap.data();

    const applicantRef = doc(db, "projects", projectId, "applicants", uid);

    const applicantSnap = await getDoc(applicantRef);

    if (applicantSnap.exists()) {
      alert("이미 지원한 프로젝트입니다.");
      return;
    }

    await setDoc(applicantRef, {
      uid,
      name: profile.name,
      role: profile.role,
      major: profile.major,
      contact: profile.contact,
      skills: profile.skills,
      status: "지원완료",
      appliedAt: serverTimestamp(),
    });

    alert("프로젝트 지원이 완료되었습니다.");
  } catch (error) {
    console.error(error);
    alert("지원 실패 : " + error.message);
  }
};

/* 지원자 보기 */
window.viewApplicants = function () {
  location.href = "applicants.html";
};

renderProjects();
renderProjectDetail();
