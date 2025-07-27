 const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("photo");
const uploadBtn = document.getElementById("upload-btn");
const previewImg = document.getElementById("photo-preview");
const uploadText = document.querySelector(".upload-text");
const actionBtns = document.querySelectorAll(".action-btn");
const uploadNote = document.getElementById("upload-note");
const submitBtn = document.querySelector(".submit-btn");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const githubInput = document.getElementById("github-username");

const nameInfo = document.getElementById("name-info");
const emailInfo = document.getElementById("email-info");
const githubInfo = document.getElementById("github-info");

 function showError(element, message) {
  element.innerHTML = `<img src="assets/images/icon-info.svg" alt="Info Icon" /> ${message}`;
  element.classList.add("error");
}

function clearError(element) {
  element.innerHTML = "";
  element.classList.remove("error");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

 ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

dropArea.addEventListener("dragenter", () => dropArea.classList.add("dragover"));
dropArea.addEventListener("dragleave", () => dropArea.classList.remove("dragover"));
dropArea.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  dropArea.classList.remove("dragover");
  handleFile(file);
});

uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file || !file.type.match(/^image\/(jpeg|png)$/)) {
    showError(uploadNote, "File type not supported!");
    return;
  }

  if (file.size > 500 * 1024) {
    showError(uploadNote, "File too large. Please upload a photo under 500KB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;
    previewImg.classList.remove("hidden");
    uploadBtn.classList.add("hidden");
    uploadText.classList.add("hidden");
    actionBtns.forEach(btn => btn.classList.remove("hidden"));
    clearError(uploadNote);
  };
  reader.readAsDataURL(file);
}

function removeImage(e) {
  e.preventDefault();
  previewImg.src = "";
  previewImg.classList.add("hidden");
  uploadBtn.classList.remove("hidden");
  uploadText.classList.remove("hidden");
  actionBtns.forEach(btn => btn.classList.add("hidden"));
  fileInput.value = "";
}

function changeImage(e) {
  e.preventDefault();
  fileInput.click();
}

//Form Submit
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const github = githubInput.value.trim();
  const photo = previewImg.src;

  // Clear all previous errors
  [nameInfo, emailInfo, githubInfo, uploadNote].forEach(clearError);

  //Validations
  if (!name) return showError(nameInfo, "Please provide full name!");
  if (!email) return showError(emailInfo, "Please provide your email!");
  if (!isValidEmail(email)) return showError(emailInfo, "Please enter a valid email address!");
  if (!github) return showError(githubInfo, "Please provide your GitHub username!");
  if (!github.startsWith("@")) return showError(githubInfo, 'GitHub username must start with "@"!');
  if (!photo) return showError(uploadNote, "Please upload a jpg or png file!");

  //Save to Local Storage
  const formData = { name, email, github, photo };
  localStorage.setItem("ticketData", JSON.stringify(formData));
  window.location.href = "ticket.html";
});
