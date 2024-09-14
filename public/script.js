const endButton = document.getElementById('end-btn');
const userVideo = document.getElementById('user-video');


const state = {media:null};
const socket = io();
const startButton = document.getElementById('start-btn');

startButton.addEventListener('click',()=>{
    const mediaRecorder = new MediaRecorder(state.media, {
        audioBitsPerSecond:128000,
        videoBitsPerSecond:2500000,
        framerate:25
    });

    mediaRecorder.ondataavailable = ev =>{
        console.log("binary stream :", ev.data);
        socket.emit ('binarystream',ev.data);
    }

    mediaRecorder.start(25); 
})

window.addEventListener("load", async (e) => {
  const media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  state.media = media; 
  userVideo.srcObject = media;
});