import TextBox from './TextBox';
import Connector from './Connector';
import BoxContainer from './BoxContainer';
import { canvasElement } from '../services/visualize';

class Visualizer {
  objects: any[];
  inputSection: HTMLElement;
  inputElement: HTMLInputElement;
  buttonElement: HTMLButtonElement;
  canvasElement: HTMLCanvasElement;

  constructor() {
    this.canvasElement = canvasElement;
    this.inputSection = document.getElementById('input-section') as HTMLElement;
    this.inputElement = document.getElementById('filename-input') as HTMLInputElement;
    this.buttonElement = document.getElementById('visualize-button') as HTMLButtonElement;
    this.buttonElement.onclick = () => this.visualize(this.inputElement.value);

    canvasElement.width = window.innerWidth - 12;
    canvasElement.height = window.innerHeight - 12;
    canvasElement.style.display = 'none';
  }

  async visualize(filename: string) {
    const res = await fetch(`http://localhost:3000?filename=${filename}&abc=xyz`);
    const imports = await res.json();

    this.inputSection.style.display = 'none';
    canvasElement.style.display = 'block';
    const box1 = new TextBox({ x: 10, y: 10 }, 'This is a text');
    const box2 = new TextBox({ x: 100, y: 100 }, 'This is another\n\n\n\nasdasdasdasdasdasdasdasdas\ntext');
    const box3 = new TextBox({ x: 300, y: 100 }, 'This is another\n\n\n\nasdasdasdasdasdasdasdasdas\ntext');
    const container = new BoxContainer([box2, box3], 'asdasd');
    const connector = new Connector(box1, container);
    this.objects = [box1, box2, box3, container, connector];

    this.drawObjects();
  }

  drawObjects() {
    this.objects.forEach((object) => object.draw());
  }
}

export default Visualizer;
