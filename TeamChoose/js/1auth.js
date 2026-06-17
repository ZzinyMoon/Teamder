// 회원가입

function signup() {
  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const confirmPassword = document.getElementById("confirmPassword").value;

  if (
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    alert("모든 항목을 입력해주세요.");
    return;
  }

  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const user = {
    name,
    email,
    password,
  };

  localStorage.setItem("user", JSON.stringify(user));

  alert("회원가입 완료!");

  location.href = "interest.html";
}

// 로그인

function login() {
  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (!savedUser) {
    alert("회원가입을 먼저 진행해주세요.");

    return;
  }

  if (email === savedUser.email && password === savedUser.password) {
    localStorage.setItem("isLoggedIn", "true");

    alert("로그인 성공!");

    location.href = "match.html";
  } else {
    alert("이메일 또는 비밀번호가 틀렸습니다.");
  }
}

// 로그아웃

function logout() {
  localStorage.removeItem("isLoggedIn");

  location.href = "index.html";
}
