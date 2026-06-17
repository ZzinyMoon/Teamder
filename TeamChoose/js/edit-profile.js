const profile = JSON.parse(localStorage.getItem("profile"));

if (profile) {
  document.getElementById("major").value = profile.major || "";

  document.getElementById("skills").value = profile.skills || "";

  document.getElementById("intro").value = profile.intro || "";
}

function updateProfile() {
  const updatedProfile = {
    ...profile,

    major: document.getElementById("major").value,

    skills: document.getElementById("skills").value,

    intro: document.getElementById("intro").value,
  };

  localStorage.setItem("profile", JSON.stringify(updatedProfile));

  alert("프로필이 수정되었습니다.");

  location.href = "mypage.html";
}
