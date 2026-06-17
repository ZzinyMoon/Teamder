const profile = JSON.parse(localStorage.getItem("profile"));

if (!profile) {
  location.href = "profile.html";
}

document.getElementById("role").textContent = profile.role;

document.getElementById("major").textContent = profile.major;

document.getElementById("intro").textContent = profile.intro;

const skillBox = document.getElementById("skillBox");

const skills = profile.skills.split(",");

skills.forEach((skill) => {
  skillBox.innerHTML += `
        <div class="skill">

            ${skill.trim()}

        </div>
    `;
});

if (profile.image) {
  document.getElementById("profileImage").innerHTML = `
        <img
            src="${profile.image}"
            style="
            width:100%;
            height:100%;
            object-fit:cover;
            border-radius:50%;
            ">
    `;
}
