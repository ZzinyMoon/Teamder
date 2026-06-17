let selectedCategory = "전체";

function selectCategory(element) {
  document.querySelectorAll(".select-card").forEach((card) => {
    card.classList.remove("active");
  });

  element.classList.add("active");

  selectedCategory = element.innerText.trim();
}

function saveCategory() {
  localStorage.setItem("selectedCategory", selectedCategory);

  location.href = "match.html";
}
