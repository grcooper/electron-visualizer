const dat = require('dat.gui');

class BaseVisualizer {

  constructor(analyzer, canvas, canvasCtx) {
    this.analyzer             = analyzer;
    this.canvasCtx            = canvasCtx;
    this.canvas               = canvas;
    this.bufferLength         = analyzer.frequencyBinCount;
    this.frequencyDataArray   = new Uint8Array(this.bufferLength);
    this.timeDataArray        = new Uint8Array(this.bufferLength);

    this.height = 1;
    this.width = 2.5;
  }

  update() {
    // Update variables
    this.analyzer.getByteFrequencyData(this.frequencyDataArray);
    this.analyzer.getByteTimeDomainData(this.timeDataArray);

    this.draw();
  }

  draw() {
    // Draw shapes to the screen
    this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
    var barWidth = (this.canvas.width / this.bufferLength) * this.width;
    var barHeight;
    var x = 0;
  
    for(var i = 0; i < this.bufferLength; i++) {
      barHeight = this.frequencyDataArray[i] * this.height;
  
      this.canvasCtx.fillStyle = 'rgb(50,50,50)';
      this.canvasCtx.fillRect(x,this.canvas.height-barHeight,barWidth,barHeight);
  
      x += barWidth - 1;
    }
  }

  toggleGui() {
    if(this.gui) {
      this.destroyGui();
    }
    else {
      this.createGui();
    }
  }

  destroyGui() {
    this.gui.destroy();
    this.gui = null;
  }

  createGui() {
    this.gui = new dat.GUI();
    this.gui.add(this, 'height', 0, 10);
    this.gui.add(this, 'width', 0, 10);
  }
}

module.exports = BaseVisualizer