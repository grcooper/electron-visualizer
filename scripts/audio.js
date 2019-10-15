const ColorVisualizer = require('./color_visualizer');

const audioInputSelect = document.getElementById('audioSource');
const startBtn = document.getElementById('startBtn');
const selectors = [audioInputSelect];
const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d');

var analyzer;
var visualizer;

function start() {
  startBtn.style.display = "none";
  audioInputSelect.style.display = "none";

  const audioSource = audioInputSelect.value;

  const constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined}
  };

  navigator.mediaDevices.getUserMedia(constraints).then(visualize);
}

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
      audioInputSelect.appendChild(option);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

function visualize(stream) {
  window.stream = stream; // make stream available to console

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyzer = audioCtx.createAnalyser();

  source = audioCtx.createMediaStreamSource(stream);

  source.connect(analyzer);

  analyzer.fftSize = 2048;

  visualizer = new ColorVisualizer(analyzer, canvas, canvasCtx);
  visualizer.createGui();
  canvas.onclick = function() {
    visualizer.toggleGui();
  }

  draw();
}

function draw() {
  requestAnimationFrame(draw);

  visualizer.update(analyzer, canvas, canvasCtx);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
 // Register an event listener to call the resizeCanvas() function 
 // each time the window is resized.
 window.addEventListener('resize', resizeCanvas, false);
 // Draw canvas border for the first time.
 resizeCanvas();
 
startBtn.onclick = start;

navigator.mediaDevices.enumerateDevices()
.then(gotDevices);
