const imageInput = document.getElementById("profileImage");

const previewImage = document.getElementById("previewImage");

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    previewImage.innerHTML = `
                <img
                    src="${e.target.result}"
                    style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    border-radius:50%;
                    ">
            `;

    localStorage.setItem("profileImage", e.target.result);
  };

  reader.readAsDataURL(file);
});

function saveProfile() {
  const profile = {
    interests: JSON.parse(localStorage.getItem("interests")),

    role: localStorage.getItem("role"),

    major: document.getElementById("major").value,

    skills: document.getElementById("skills").value,

    intro: document.getElementById("intro").value,

    image: localStorage.getItem("profileImage"),
  };

  localStorage.setItem("profile", JSON.stringify(profile));

  location.href = "match.html";
}
