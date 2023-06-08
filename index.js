let form = document.querySelector("#upload");
let file = document.querySelector("#file");
let app = document.querySelector("#app");
let mood = document.querySelector("#result");
let songsBox = document.querySelector("#songs");
let nextImageEl = document.querySelector("#nextImageEl");
let flag = 0;

const url = "http://localhost:3001/predict";

function displayRecommendedSongs(songs_arr) {
  const num = songs_arr.length;
  for (let i = 0; i < num; i++) {
    let song_element = document.createElement("div");
    song_element.className = "song";
    song_element.innerHTML = `<a href=${songs_arr[i].url} target="_blank">${songs_arr[i].name}</a>`;
    songsBox.appendChild(song_element);
  }
}

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
  img.height = 200;
  app.append(img);
}

const handleSubmit = (event) => {
  event.preventDefault();
  if (!file.value.length) return;

  if (flag === 0) {
    // Create a new FileReader() object
    var reader = new FileReader();

    // Setup the callback event to run when the file is read
    reader.onload = logFile;
    flag = 1;
  }

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
        mood.innerHTML = data.mood;
        displayRecommendedSongs(data.songs_recommendation);
      })
      .catch((error) => {
        console.error(error);
      });
  });
};

form.addEventListener("submit", handleSubmit);
nextImageEl.addEventListener("click", (e) => {
  e.preventDefault();
  flag = 0;
  window.location.reload();
});
