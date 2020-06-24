import Box from './Box';
import Location from '../types/Location';
import { ctx, TEXT_HEIGHT } from '../services/visualize';

class TextBox extends Box {
  text: string;
  textArr: string[];
  textWidth: number;
  textHeight: number;
  textPosition: Location;

  static getMaxWidth(textArr: string[]) {
    let maxWidth: number = 0;

    textArr.forEach((line) => {
      const currentWidth = ctx.measureText(line).width;

      if (currentWidth > maxWidth) {
        maxWidth = currentWidth;
      }
    });

    return maxWidth;
  }

  constructor(pos: Location, text: string) {
    const textArr = text.split('\n');
    const textWidth = TextBox.getMaxWidth(textArr);
    const textHeight = TEXT_HEIGHT + 1.5 * TEXT_HEIGHT * textArr.length;
    const dimensions = {
      width: textWidth + 2 * TEXT_HEIGHT,
      height: textHeight,
    };

    super(pos, dimensions);
    this.text = text;
    this.textArr = textArr;
    this.textWidth = textWidth;
    this.textHeight = textHeight;
    this.textPosition = {
      x: this.position.x + TEXT_HEIGHT,
      y: this.position.y,
    };
  }

  draw() {
    this.drawBox();
    this.drawText();
  }

  drawBox() {
    super.draw();
  }

  drawText() {
    ctx.beginPath();
    this.textArr.forEach((line, i) =>
      ctx.fillText(line, this.textPosition.x, this.textPosition.y + (i + 1) * 1.5 * TEXT_HEIGHT)
    );
    ctx.stroke();
    ctx.closePath();
  }
}

export default TextBox;
