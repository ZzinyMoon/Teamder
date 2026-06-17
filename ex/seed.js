import { db } from "../js/firebase.js";

import {
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const profiles = [
  {
    uid: "demo1",
    name: "김민준",
    major: "컴퓨터공학과",
    role: "Frontend",
    selectedCategory: "웹개발",
    skills: "React,JavaScript,CSS",
    intro: "사용자 경험을 중요하게 생각하는 프론트엔드 개발자입니다.",
  },
  {
    uid: "demo2",
    name: "박지훈",
    major: "소프트웨어학과",
    role: "Backend",
    selectedCategory: "웹개발",
    skills: "Node.js,Express,MongoDB",
    intro: "안정적인 서버 구축을 담당합니다.",
  },
  {
    uid: "demo3",
    name: "이서연",
    major: "시각디자인학과",
    role: "Designer",
    selectedCategory: "디자인",
    skills: "Figma,Photoshop,Illustrator",
    intro: "UI/UX 디자이너입니다.",
  },
  {
    uid: "demo4",
    name: "정현우",
    major: "예술공학과",
    role: "VFX Artist",
    selectedCategory: "VFX",
    skills: "Nuke,After Effects,Blender",
    intro: "실사 합성과 크리처 작업을 좋아합니다.",
  },
  {
    uid: "demo5",
    name: "최유진",
    major: "영상애니메이션학과",
    role: "3D Artist",
    selectedCategory: "3D",
    skills: "Blender,Maya,Substance Painter",
    intro: "3D 모델링과 텍스처링 담당입니다.",
  },
  {
    uid: "demo6",
    name: "한지민",
    major: "경영학과",
    role: "PM",
    selectedCategory: "창업",
    skills: "기획,문서작성,발표",
    intro: "프로젝트 일정 관리 담당입니다.",
  },
  {
    uid: "demo7",
    name: "강도윤",
    major: "인공지능학과",
    role: "AI Engineer",
    selectedCategory: "AI",
    skills: "Python,TensorFlow,PyTorch",
    intro: "AI 모델 개발을 담당합니다.",
  },
  {
    uid: "demo8",
    name: "윤채원",
    major: "컴퓨터공학과",
    role: "Full Stack",
    selectedCategory: "웹개발",
    skills: "React,Node.js,MongoDB",
    intro: "풀스택 개발자입니다.",
  },
];

const projects = [
  {
    title: "캡스톤 팀원 모집",
    role: "Frontend",
    author: "김민준",
    authorUid: "demo1",
    desc: "학교 행사 통합 플랫폼 제작",
  },
  {
    title: "공모전 영상 제작",
    role: "VFX Artist",
    author: "정현우",
    authorUid: "demo4",
    desc: "환경 공익광고 영상 제작",
  },
  {
    title: "AI 일정관리 앱",
    role: "Backend",
    author: "강도윤",
    authorUid: "demo7",
    desc: "AI 기반 일정관리 서비스",
  },
  {
    title: "게임 제작 프로젝트",
    role: "3D Artist",
    author: "최유진",
    authorUid: "demo5",
    desc: "언리얼 엔진 기반 게임",
  },
  {
    title: "스터디 매칭 서비스",
    role: "Designer",
    author: "이서연",
    authorUid: "demo3",
    desc: "대학생 스터디 매칭 플랫폼",
  },
  {
    title: "동아리 홈페이지 제작",
    role: "Frontend",
    author: "윤채원",
    authorUid: "demo8",
    desc: "동아리 홍보 사이트 제작",
  },
  {
    title: "창업 아이템 개발",
    role: "PM",
    author: "한지민",
    authorUid: "demo6",
    desc: "대학생 창업 아이템 기획",
  },
  {
    title: "AI 이미지 생성",
    role: "AI Engineer",
    author: "강도윤",
    authorUid: "demo7",
    desc: "생성형 AI 프로젝트",
  },
  {
    title: "영화 VFX 제작",
    role: "VFX Artist",
    author: "정현우",
    authorUid: "demo4",
    desc: "크리처 합성 프로젝트",
  },
  {
    title: "메타버스 전시관",
    role: "3D Artist",
    author: "최유진",
    authorUid: "demo5",
    desc: "가상 전시 공간 제작",
  },
];

async function seed() {
  const profileSnapshot = await getDocs(collection(db, "profiles"));

  if (profileSnapshot.empty) {
    for (const profile of profiles) {
      await addDoc(collection(db, "profiles"), profile);
    }
  }

  const projectSnapshot = await getDocs(collection(db, "projects"));

  if (projectSnapshot.empty) {
    for (const project of projects) {
      await addDoc(collection(db, "projects"), project);
    }
  }

  alert("샘플 데이터 생성 완료");
}

seed();
