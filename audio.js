const audioInputSelect = document.getElementById('audioSource');
const startBtn = document.getElementById('startBtn');
const selectors = [audioInputSelect];
const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d');

var analyzer
var dataArray
var bufferLength

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

  bufferLength = analyzer.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  draw();
}

function draw() {
  requestAnimationFrame(draw);
  analyzer.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  var barWidth = (canvas.width / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * controller.height;

    canvasCtx.fillStyle = 'rgb(50,50,50)';
    canvasCtx.fillRect(x,canvas.height-barHeight/2,barWidth,barHeight);

    x += barWidth + 1;
  }
}

function start() {
  startBtn.style.display = "none";
  audioInputSelect.style.display = "none";
	// Second call to getUserMedia() with changed device may cause error, so we need to release stream before changing device
  if (window.stream) {
  	stream.getAudioTracks()[0].stop();
  }

  const audioSource = audioInputSelect.value;
  
  const constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined}
  };
  
  navigator.mediaDevices.getUserMedia(constraints).then(visualize);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}


const dat = require('dat.gui');

var DataController = function() {
  this.height = 1;
}

var controller = new DataController();

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(controller, 'height', 0, 10);
}


// Things to do when this file is run
startBtn.onclick = start;

navigator.mediaDevices.enumerateDevices()
.then(gotDevices);

 // Register an event listener to call the resizeCanvas() function 
 // each time the window is resized.
 window.addEventListener('resize', resizeCanvas, false);
 // Draw canvas border for the first time.
 resizeCanvas();