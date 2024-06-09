import "./style/reset.css";
import "./style/style.css";

document.addEventListener("DOMContentLoaded", (event) => {
  const cubeIdArray = ["cubeinteract"];
  const cubeArray = [];

  cubeIdArray.forEach((cubeId) => {
    const cubElem = document.getElementById(cubeId);
    cubeArray.push(cubElem);
  });

  // Variables pour le déplacement sur mobile
  let isDragging = false;
  let startX, startY;
  let initialX, initialY;

  // Fonction de démarrage du déplacement
  const startDrag = (e) => {
    isDragging = true;
    startX = e.touches ? e.touches[0].pageX : e.clientX;
    startY = e.touches ? e.touches[0].pageY : e.clientY;
    initialX = window.scrollX;
    initialY = window.scrollY;
    e.preventDefault();
  };

  // Fonction de déplacement
  const drag = (e) => {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].pageX : e.clientX;
    const y = e.touches ? e.touches[0].pageY : e.clientY;
    const dx = startX - x;
    const dy = startY - y;
    window.scrollTo(initialX + dx, initialY + dy);
    e.preventDefault();
  };

  // Fonction de fin du déplacement
  const endDrag = () => {
    isDragging = false;
  };

  // Ajouter les gestionnaires d'événements pour les mobiles
  window.addEventListener("touchstart", startDrag);
  window.addEventListener("touchmove", drag);
  window.addEventListener("touchend", endDrag);

  // Ajouter les gestionnaires d'événements pour la souris (pour le débogage sur desktop)
  window.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", drag);
  window.addEventListener("mouseup", endDrag);

  window.addEventListener("mousemove", (e) => {
    const xPosition = e.clientX;
    const yPosition = e.clientY;
    const currentXDeg = map(xPosition, 0, window.innerWidth, -160, -110);
    const currentYDeg = map(yPosition, 0, window.innerHeight, -5, -25);

    for (let i = 0; i < cubeArray.length; i++) {
      cubeArray[
        i
      ].style.transform = `rotateX(${currentYDeg}deg) rotateY(${currentXDeg}deg)`;
    }
  });

  window.addEventListener(
    "click",
    () =>
      typeof DeviceOrientationEvent === "object" &&
      DeviceOrientationEvent?.requestPermission?.(),
    {
      once: true,
    }
  );

  window.addEventListener("deviceorientation", (event) => {
    const x = event.beta;
    const y = event.gamma;
    const currentXDeg = map(x, -180, 180, -160, -110);
    const currentYDeg = map(y, -90, 90, -5, -25);

    for (let i = 0; i < cubeArray.length; i++) {
      cubeArray[
        i
      ].style.transform = `rotateX(${currentYDeg}deg) rotateY(${currentXDeg}deg)`;
    }
  });

  initializeScene(); // Initialize the first scene

  // Toggle lyrics visibility
  const toggleLyricsBtn = document.getElementById("toggle-lyrics-btn");
  const lyricsContainer = document.getElementById("lyrics-container");

  toggleLyricsBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the click from triggering scene change
    if (lyricsContainer.classList.contains("hidden")) {
      lyricsContainer.classList.remove("hidden");
      toggleLyricsBtn.textContent = "Hide Lyrics";
    } else {
      lyricsContainer.classList.add("hidden");
      toggleLyricsBtn.textContent = "Show Lyrics";
    }
  });
});

function map(num, start1, stop1, start2, stop2) {
  return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

let count = 0; // Global variable to keep track of the current scene

const initializeScene = () => {
  const scenes = 11; // Assuming you have 11 scenes, including the initial one (0 to 10)
  const audioTracks = [
    "audio/NasTheGenesis.mp3", // Track 1
    "audio/NasNYStateOfMind.mp3", // Track 2
    "audio/NasLifesABitch.mp3", // Track 3
    "audio/NasTheWorldIsYours.mp3", // Track 4
    "audio/NasHalftime.mp3", // Track 5
    "audio/NasMemoryLane.mp3", // Track 6
    "audio/NasOneLove.mp3", // Track 7
    "audio/NasOneTime4YourMind.mp3", // Track 8
    "audio/NasRepresent.mp3", // Track 9
    "audio/NasItAintHardToTell.mp3", // Track 10
  ];

  const lyrics = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames.",
    "Curabitur venenatis ut elit quis tempus, sed eget sem pretium. Proin.",
    "Sed euismod nisi porta lorem mollis aliquam. Vestibulum ac diam sit.",
    "Ut lectus arcu bibendum at varius. Aenean vel elit scelerisque mauris.",
    "Nam libero justo laoreet sit amet cursus sit amet dictum. Mi.",
    "Integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque.",
    "Et malesuada fames ac turpis egestas. Euismod lacinia at quis risus.",
    "Purus faucibus ornare suspendisse sed nisi lacus. Pulvinar neque laoreet.",
    "Est ultricies integer quis auctor elit sed vulputate mi sit.",
  ];

  const audioElement = document.getElementById("background-audio");
  const lyricsElement = document.getElementById("lyrics");

  document.body.addEventListener("click", () => {
    changeScene(audioTracks, lyrics, audioElement, lyricsElement, scenes);
  });

  // Initialize first scene
  showTitle(0);
  updateLyrics(0, lyricsElement, lyrics);
  audioElement.src = audioTracks[0];
  audioElement.play().catch((error) => {
    console.log("Autoplay was prevented:", error);
  });
};

const changeScene = (
  audioTracks,
  lyrics,
  audioElement,
  lyricsElement,
  scenes
) => {
  hideTitle(count); // Hide current title
  document.body.classList.remove(`is-scene-${count}`);
  audioElement.pause();

  count++;
  if (count >= scenes) {
    count = 0;
  }

  document.body.classList.add(`is-scene-${count}`);
  showTitle(count); // Show title for the new scene
  updateLyrics(count, lyricsElement, lyrics); // Update lyrics for the new scene

  // Adjust the index for the audio track to be one scene ahead
  const audioTrackIndex = count === 0 ? audioTracks.length - 1 : count - 1;
  audioElement.src = audioTracks[audioTrackIndex];
  audioElement.play().catch((error) => {
    console.log("Autoplay was prevented:", error);
  });
};

const updateLyrics = (sceneIndex, lyricsElement, lyrics) => {
  const lyricsIndex = sceneIndex === 0 ? lyrics.length - 1 : sceneIndex - 1;
  lyricsElement.textContent = lyrics[lyricsIndex];
};

const showTitle = (scene) => {
  const titleContainers = document.querySelectorAll(".title");
  titleContainers.forEach((container) => {
    if (parseInt(container.getAttribute("data-scene")) === scene) {
      container.classList.add("active");
      container.classList.remove("exit");
    } else {
      container.classList.remove("active");
    }
  });
};

const hideTitle = (scene) => {
  const titleContainers = document.querySelectorAll(".title");
  titleContainers.forEach((container) => {
    if (parseInt(container.getAttribute("data-scene")) === scene) {
      container.classList.add("exit");
      container.classList.remove("active");
    }
  });
};
