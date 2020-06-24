import Box from './Box';
import TextBox from './TextBox';
import Connector from './Connector';
import Location from '../types/Location';
import BoxContainer from './BoxContainer';
import { canvasElement } from '../services/visualize';
import {
  SERVER_PORT,
  CANVAS_WINDOW_MARGIN,
  BOX_VISUALIZATION_MARGIN_X,
  BOX_VISUALIZATION_MARGIN_Y,
} from '../constants';

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

    canvasElement.width = window.innerWidth - CANVAS_WINDOW_MARGIN;
    canvasElement.height = window.innerHeight - CANVAS_WINDOW_MARGIN;

    this.hideCanvas();
  }

  hideCanvas() {
    this.inputSection.style.display = 'block';
    this.canvasElement.style.display = 'none';
  }

  showCanvas() {
    this.inputSection.style.display = 'none';
    this.canvasElement.style.display = 'block';
  }

  async visualize(filename: string) {
    const res = await fetch(`http://localhost:${SERVER_PORT}?filename=${filename}`);
    const response = await res.json();
    const moduleMap: { [key: string]: number } = {};
    const modules = { ...response.imports, ...response.entrypoints };

    this.showCanvas();

    this.objects = [];

    let startPos = { x: BOX_VISUALIZATION_MARGIN_X, y: BOX_VISUALIZATION_MARGIN_Y };

    for (const module in modules) {
      const pathArr = module.split('/');
      const moduleInfo = modules[module];

      const infoBox = new TextBox(
        startPos,
        JSON.stringify({ IsLocal: moduleInfo.IsLocal, IsDir: moduleInfo.Info.IsDir }, null, 4)
      );
      const moduleBox = new BoxContainer(infoBox, pathArr[pathArr.length - 1]);

      this.objects.push(infoBox, moduleBox);
      moduleMap[module] = this.objects.length - 1;

      if (startPos.x + 2 * (moduleBox.dimensions.width + BOX_VISUALIZATION_MARGIN_X) > this.canvasElement.width) {
        startPos = {
          x: BOX_VISUALIZATION_MARGIN_X,
          y: startPos.y + moduleBox.dimensions.height + BOX_VISUALIZATION_MARGIN_Y,
        };
      } else {
        startPos = {
          x: startPos.x + moduleBox.dimensions.width + BOX_VISUALIZATION_MARGIN_X,
          y: startPos.y,
        };
      }

      if (this.canvasElement.height < startPos.y + moduleBox.dimensions.height + BOX_VISUALIZATION_MARGIN_Y) {
        this.growCanvasHeight(startPos.y + moduleBox.dimensions.height + BOX_VISUALIZATION_MARGIN_Y);
      }
    }

    for (const module in modules) {
      const importers = modules[module].Info.Importers;

      importers.forEach((importer: any) => {
        moduleMap[module] &&
          moduleMap[importer.Path] &&
          this.objects.push(new Connector(this.objects[moduleMap[importer.Path]], this.objects[moduleMap[module]]));
      });
    }

    this.drawObjects();
  }

  calcNextModuleStartPos(currentStartPos: Location, currentBox: Box) {
    const nextColumnStartX = currentStartPos.x + currentBox.dimensions.width + BOX_VISUALIZATION_MARGIN_X;
    const nextRowStartY = currentStartPos.y + currentBox.dimensions.height + BOX_VISUALIZATION_MARGIN_Y;
    const projectedWidthForNextBox = currentBox.dimensions.width;

    if (nextColumnStartX + projectedWidthForNextBox > this.canvasElement.width) {
      return {
        x: BOX_VISUALIZATION_MARGIN_X,
        y: nextRowStartY,
      };
    }

    return {
      x: nextColumnStartX,
      y: currentStartPos.y,
    };

  }

  growCanvasHeight(newHeight: number) {
    this.canvasElement.height = newHeight;

    this.canvasElement.width = window.innerWidth - CANVAS_WINDOW_MARGIN;
  }

  testDraw() {
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
