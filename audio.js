const audioInputSelect = document.getElementById('audioSource');
const startBtn = document.getElementById('startBtn');
const selectors = [audioInputSelect];
const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d');

var analyzer
var dataArray
var bufferLength

const WIDTH = 500;
const HEIGHT = 100;

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

  analyzer.fftSize = 256;

  bufferLength = analyzer.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  draw();
}

function draw() {
  requestAnimationFrame(draw);
  analyzer.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i]/2;

    canvasCtx.fillStyle = 'rgb(50,50,50)';
    canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

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

startBtn.onclick = start;

navigator.mediaDevices.enumerateDevices()
.then(gotDevices);