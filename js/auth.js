import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

window.signup = async function () {
  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: new Date(),
    });

    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem("uid", user.uid);

    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: user.uid,
        name,
        email,
      }),
    );

    alert("회원가입 완료");

    location.href = "interest.html";
  } catch (error) {
    console.error(error);

    alert("회원가입 실패 : " + error.message);
  }
};

window.login = async function () {
  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("이메일과 비밀번호를 입력해주세요.");
    return;
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    const user = result.user;

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      localStorage.setItem("user", JSON.stringify(userSnap.data()));
    }

    localStorage.setItem("uid", user.uid);

    localStorage.setItem("isLoggedIn", "true");

    alert("로그인 성공");

    location.href = "match.html";
  } catch (error) {
    console.error(error);

    alert("로그인 실패 : " + error.message);
  }
};

window.logout = async function () {
  try {
    await signOut(auth);

    localStorage.clear();

    location.href = "index.html";
  } catch (error) {
    console.error(error);
  }
};
