const BaseVisualizer = require('./base_visualizer');

class ColorVisualizer extends BaseVisualizer {
  constructor(analyzer, canvas, canvasCtx) {
    super(analyzer, canvas, canvasCtx);

    this.backColor = '#ffffff';
    this.barColor = '#000000';
  }

  draw() {
    // Draw shapes to the screen
    this.canvasCtx.fillStyle = this.backColor;
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
    var barWidth = (this.canvas.width / this.bufferLength) * this.width;
    var barHeight;
    var x = 0;
  
    for(var i = 0; i < this.bufferLength; i++) {
      barHeight = this.frequencyDataArray[i] * this.height;
  
      this.canvasCtx.fillStyle = this.barColor;
      this.canvasCtx.fillRect(x,this.canvas.height-barHeight,barWidth,barHeight);
  
      x += barWidth - 1;
    }
  }

  createGui() {
    super.createGui();
    this.gui.addColor(this, 'backColor');
    this.gui.addColor(this, 'barColor');
  }
}

module.exports = ColorVisualizer