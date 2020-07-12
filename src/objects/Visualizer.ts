import Box from './Box';
import ModuleBox from './ModuleBox';
import Connector from './Connector';
import Location from '../types/Location';
import Importer from '../types/Importer';
import ModuleInfo from '../types/ModuleInfo';
import { canvasElement } from '../services/visualize';
import {
  SERVER_PORT,
  CANVAS_WINDOW_MARGIN,
  BOX_VISUALIZATION_MARGIN_X,
  BOX_VISUALIZATION_MARGIN_Y,
} from '../constants';

class Visualizer {
  boxes: ModuleBox[];
  connectors: Connector[];
  inputSection: HTMLElement;
  inputElement: HTMLInputElement;
  buttonElement: HTMLButtonElement;
  canvasElement: HTMLCanvasElement;
  moduleIdxMap: { [key: string]: number };
  moduleConnectorsMap: { [key: string]: number[] };

  constructor() {
    this.canvasElement = canvasElement;
    this.inputSection = document.getElementById('input-section') as HTMLElement;
    this.inputElement = document.getElementById('filename-input') as HTMLInputElement;
    this.buttonElement = document.getElementById('visualize-button') as HTMLButtonElement;
    this.buttonElement.onclick = () => this.visualize(this.inputElement.value);

    this.hideCanvas();

    this.boxes = [];
    this.connectors = [];
    this.moduleIdxMap = {};
    this.moduleConnectorsMap = {};
  }

  hideCanvas() {
    this.inputSection.style.display = 'block';
    this.canvasElement.style.display = 'none';
  }

  showCanvas() {
    canvasElement.width = window.innerWidth - CANVAS_WINDOW_MARGIN;
    canvasElement.height = window.innerHeight - CANVAS_WINDOW_MARGIN;

    this.inputSection.style.display = 'none';
    this.canvasElement.style.display = 'block';
  }

  async fetchData(filename: string) {
    const res = await fetch(`http://localhost:${SERVER_PORT}?filename=${filename}`);

    return res.json();
  }

  async visualize(filename: string) {
    const { entrypoints, imports } = await this.fetchData(filename)
    const modules = { ...entrypoints, ...imports };

    this.showCanvas();

    this.boxes = [];
    this.moduleIdxMap = {};
    let startPos = { x: BOX_VISUALIZATION_MARGIN_X, y: BOX_VISUALIZATION_MARGIN_Y };

    // Create modules
    for (const modulePath in modules) {
      const moduleInfo = modules[modulePath];
      const moduleBox = new ModuleBox(startPos, moduleInfo, !!entrypoints[modulePath]);

      this.boxes.push(moduleBox);
      this.moduleIdxMap[modulePath] = this.boxes.length - 1;

      // Calculate start position of next module.
      startPos = this.calcNextModuleStartPos(startPos, moduleBox);
      const nextRowStartY = startPos.y + moduleBox.dimensions.height + BOX_VISUALIZATION_MARGIN_Y;

      if (this.canvasElement.height < nextRowStartY) {
        this.growCanvasHeight(nextRowStartY);
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

  drawBoxes() {
    this.drawObjects(this.boxes);
  }

  drawConnectors(moduleBox: ModuleBox | ModuleBox[]) {
    const modBoxArr = Array.isArray(moduleBox) ? moduleBox : [moduleBox];

    modBoxArr.forEach(mb => this.moduleConnectorsMap[mb.moduleInfo.Path] &&
      this.drawObjects(this.moduleConnectorsMap[mb.moduleInfo.Path].map(idx => this.connectors[idx]))
    )
  }

  drawObjects(objects: any[]) {
    objects.forEach(object => object.draw());
  }
}

export default Visualizer;
