let form = document.querySelector("#upload");
let file = document.querySelector("#file");
let app = document.querySelector("#app");
let result = document.querySelector("#result");
const url = "http://localhost:3001/predict";

function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function logFile(event) {
  let str = event.target.result;
  let img = document.createElement("img");
  img.src = str;
  img.height = 100;
  app.append(img);
}

const handleSubmit = (event) => {
  event.preventDefault();
  if (!file.value.length) return;

  // Create a new FileReader() object
  let reader = new FileReader();

  // Setup the callback event to run when the file is read
  reader.onload = logFile;

  // Read the file
  reader.readAsDataURL(file.files[0]);

  imageInput = file.files[0];
  convertImageToBase64(imageInput).then((base64Image) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: base64Image }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  });
};

form.addEventListener("submit", handleSubmit);
