let selectedRole = "";

function selectRole(element) {
  document.querySelectorAll(".select-card").forEach((card) => {
    card.classList.remove("active");
  });

  element.classList.add("active");

  selectedRole = element.innerText;
}

function saveRole() {
  if (selectedRole === "") {
    alert("역할을 선택해주세요.");

    return;
  }

  localStorage.setItem("role", selectedRole);

  location.href = "profile.html";
}
