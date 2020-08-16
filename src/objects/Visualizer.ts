import Box from './Box';
import Arrow from './Arrow';
import ModuleBox from './ModuleBox';
import Connector from './Connector';
import Location from '../types/Location';
import Importer from '../types/Importer';
import ModuleInfo from '../types/ModuleInfo';
import { canvasElement, ctx } from '../services/visualize';
import {
  SERVER_PORT,
  CANVAS_WINDOW_MARGIN,
  BOX_VISUALIZATION_MARGIN_X,
  BOX_VISUALIZATION_MARGIN_Y
} from '../constants';

class Visualizer {
  boxes: ModuleBox[];
  connectors: Connector[];
  inputSection: HTMLElement;
  toolsSection: HTMLElement;
  toolsCollapse: HTMLElement;
  detailSection: HTMLElement;
  isToolsSectionActive: boolean;
  visualizeSection: HTMLElement;
  searchResults: HTMLUListElement;
  canvasElement: HTMLCanvasElement;
  moduleIdxMap: { [key: string]: number };
  moduleConnectorsMap: { [key: string]: number[] };

  constructor() {
    this.canvasElement = canvasElement;
    this.canvasElement.onclick = event => this.handleCanvasClickEvent(event);
    this.inputSection = document.getElementById('input-section') as HTMLElement;
    this.visualizeSection = document.getElementById('visualize-section') as HTMLElement;
    this.detailSection = document.getElementById('details') as HTMLElement;

    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    this.searchResults = document.getElementById('search-results') as HTMLUListElement;
    const searchButton = document.getElementById('search-button') as HTMLButtonElement;
    searchButton.onclick = () => this.handleSearchClick(searchInput.value);

    const plotButton = document.getElementById('plot-graph-button') as HTMLButtonElement;
    plotButton.onclick = () => this.plotGraph();

    const drawBoxButton = document.getElementById('draw-box-button') as HTMLButtonElement;
    drawBoxButton.onclick = () => this.visualize(inputElement.value);
    this.toolsSection = document.getElementById('tools-section') as HTMLUListElement;
    this.toolsCollapse = document.getElementById('tools-collapse') as HTMLUListElement;
    this.toolsCollapse.onclick = () => this.handleToolCollapseClick();
    this.isToolsSectionActive = false;
    this.toolsSection.style.display = 'none';

    const inputElement = document.getElementById('filename-input') as HTMLInputElement;
    const buttonElement = document.getElementById('visualize-button') as HTMLButtonElement;
    buttonElement.onclick = () => this.visualize(inputElement.value);

    this.hideCanvas();

    this.boxes = [];
    this.connectors = [];
    this.moduleIdxMap = {};
    this.moduleConnectorsMap = {};
  }

  hideCanvas() {
    this.inputSection.style.display = 'block';
    this.visualizeSection.style.display = 'none';
  }

  showCanvas() {
    canvasElement.width = window.innerWidth - CANVAS_WINDOW_MARGIN;
    canvasElement.height = window.innerHeight - CANVAS_WINDOW_MARGIN;

    this.inputSection.style.display = 'none';
    this.visualizeSection.style.display = 'block';
  }

  async fetchData(filename: string) {
    const res = await fetch(`http://localhost:${SERVER_PORT}?filename=${filename}`);

    return res.json();
  }

  async visualize(filename: string) {
    const { entrypoints, imports } = await this.fetchData(filename);
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
    this.createConnectors(Object.values(modules));

    this.drawBoxes();
  }

  createConnectors(modules: ModuleInfo[]) {
    // Create connectors
    for (const module of modules) {
      const importers = module.Info.Importers;
      const modulePath = module.Path;

      importers.forEach(({ Path: importerPath }: Importer) => {
        this.connectors.push(
          new Connector(this.boxes[this.moduleIdxMap[importerPath]], this.boxes[this.moduleIdxMap[modulePath]])
        );
        const lastIndex = this.connectors.length - 1;

        if (this.moduleConnectorsMap[importerPath]) {
          this.moduleConnectorsMap[importerPath].push(lastIndex);
        } else {
          this.moduleConnectorsMap[importerPath] = [lastIndex];
        }
      });
    }
  }

  calcNextModuleStartPos(currentStartPos: Location, currentBox: Box) {
    const nextColumnStartX = currentStartPos.x + currentBox.dimensions.width + BOX_VISUALIZATION_MARGIN_X;
    const nextRowStartY = currentStartPos.y + currentBox.dimensions.height + BOX_VISUALIZATION_MARGIN_Y;
    const projectedWidthForNextBox = currentBox.dimensions.width;

    if (nextColumnStartX + projectedWidthForNextBox > this.canvasElement.width) {
      return {
        x: BOX_VISUALIZATION_MARGIN_X,
        y: nextRowStartY
      };
    }

    return {
      x: nextColumnStartX,
      y: currentStartPos.y
    };
  }

  handleToolCollapseClick() {
    this.isToolsSectionActive = !this.isToolsSectionActive;

    if (this.isToolsSectionActive) {
      this.toolsCollapse.innerHTML = '>';
      this.toolsSection.style.display = 'block';

      return;
    }

    this.toolsCollapse.innerHTML = '<';
    this.toolsSection.style.display = 'none';
  }

  handleSearchClick(str: string) {
    const matchingBoxes = this.findAllModules(box => box.text.toLowerCase().includes(str.toLowerCase()));
    this.searchResults.innerHTML = '';

    if (!matchingBoxes.length) {
      return;
    }

    const searchResults: HTMLElement[] = [];

    for (let matchingBox of matchingBoxes) {
      const listItem = document.createElement('LI');
      searchResults.push(listItem);

      listItem.innerText = matchingBox.text;

      listItem.onclick = () => {
        searchResults.forEach(result => (result.className = ''));

        listItem.className = 'active';
        scrollTo({ top: matchingBox.textPosition.y });
        this.redrawBoxes();
        new Box(matchingBox.position, matchingBox.dimensions, { background: '#ff0' }).draw();
      };

      this.searchResults.appendChild(listItem);
    }

    if (!this.isToolsSectionActive) {
      this.toolsCollapse.click();
    }
  }

  plotGraph() {
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    const importerCountMap = this.boxes
      .filter(box => box.moduleInfo.IsLocal)
      .reduce(
        (acc, box, index) => {
          const curImporterLength = box.moduleInfo.Info.Importers.length;
          const importsCount = this.moduleConnectorsMap[box.moduleInfo.Path]?.length || 0;

          acc.maxX = acc.maxX > curImporterLength ? acc.maxX : curImporterLength;
          acc.maxY = acc.maxY > importsCount ? acc.maxY : importsCount;
          acc.points.push({ x: curImporterLength, y: importsCount, index });

          return acc;
        },
        { maxX: 0, maxY: 0, points: [] } as {
          maxX: number;
          maxY: number;
          points: { x: number; y: number; index: number }[];
        }
      );

    const RADIUS = 5;
    const X_SCALE = 10;
    const Y_SCALE = 10;
    const graphXMax = (importerCountMap.maxX + 4) * X_SCALE + BOX_VISUALIZATION_MARGIN_X;
    const graphYMax = (importerCountMap.maxY + 4) * Y_SCALE;
    const calcXCoord = (importerCount: number) => +importerCount * X_SCALE + BOX_VISUALIZATION_MARGIN_X;
    const calcYCoord = (importsCount: number) => graphYMax - importsCount * Y_SCALE;

    this.canvasElement.onclick = event => {
      const infos = importerCountMap.points
        .filter(point => {
          const xCoord = calcXCoord(point.x);
          const yCoord = calcYCoord(point.y);

          return (
            event.offsetY >= yCoord - RADIUS &&
            event.offsetY <= yCoord + RADIUS &&
            event.offsetX >= xCoord - RADIUS &&
            event.offsetX <= xCoord + RADIUS
          );
        })
        .map(clickedPoint => {
          const moduleInfo = this.boxes[clickedPoint.index].moduleInfo;

          new ModuleBox({ x: calcXCoord(clickedPoint.x), y: calcYCoord(clickedPoint.y) }, moduleInfo, false).draw();

          return moduleInfo;
        });

      this.detailSection.innerHTML = infos.reduce((acc, curModuleInfo, idx) => {
        JSON.stringify(curModuleInfo, null, 2)
          .replace(/ /g, '&nbsp;')
          .split('\n')
          .map(line => `<p>${line}</p>`)
          .join('');
        acc += `
          <li>${idx + 1}
            <details><summary>${curModuleInfo.Path.split('/').pop()}</summary>${curModuleInfo}</details>
          </li>
        `;

        return acc;
      }, '');
    };

    this.canvasElement.width = 1800 > graphXMax ? window.innerWidth - CANVAS_WINDOW_MARGIN : graphXMax;

    for (const { x: importerCount, y: importsCount } of importerCountMap.points) {
      ctx.beginPath();
      ctx.arc(calcXCoord(importerCount), calcYCoord(importsCount), RADIUS, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
    const centerX = window.innerWidth / 2 + BOX_VISUALIZATION_MARGIN_X;
    const defaultArrowX = window.innerWidth - 2 * BOX_VISUALIZATION_MARGIN_X;
    ctx.fillText('Imports Count', BOX_VISUALIZATION_MARGIN_X, BOX_VISUALIZATION_MARGIN_Y - 10);
    ctx.fillText('Imported By Count', centerX, graphYMax + BOX_VISUALIZATION_MARGIN_Y);
    new Arrow(
      { x: BOX_VISUALIZATION_MARGIN_X, y: graphYMax },
      { x: defaultArrowX > graphXMax ? defaultArrowX : graphXMax, y: graphYMax }
    ).draw();
    new Arrow(
      { x: BOX_VISUALIZATION_MARGIN_X, y: graphYMax },
      { x: BOX_VISUALIZATION_MARGIN_X, y: BOX_VISUALIZATION_MARGIN_Y }
    ).draw();
  }

  handleCanvasClickEvent(event: MouseEvent) {
    const clickedBox = this.getClickedBox(event.offsetX, event.offsetY);

    if (!clickedBox) {
      return;
    }

    this.redrawBoxes();
    this.drawConnectors(clickedBox);
    this.detailSection.innerHTML = JSON.stringify(clickedBox.moduleInfo, null, 2)
      .replace(/ /g, '&nbsp;')
      .split('\n')
      .map(line => `<li>${line}</li>`)
      .join('');
  }

  getClickedBox(clickX: number, clickY: number) {
    return this.findModule(box => box.contains(clickX, clickY));
  }

  growCanvasHeight(newHeight: number) {
    this.canvasElement.height = newHeight;

    this.canvasElement.width = window.innerWidth - CANVAS_WINDOW_MARGIN;
  }

  drawBoxes() {
    this.drawObjects(this.boxes);
  }

  redrawBoxes() {
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.drawBoxes();
  }

  drawConnectors(moduleBox: ModuleBox | ModuleBox[]) {
    const modBoxArr = Array.isArray(moduleBox) ? moduleBox : [moduleBox];

    modBoxArr.forEach(
      mb =>
        this.moduleConnectorsMap[mb.moduleInfo.Path] &&
        this.drawObjects(this.moduleConnectorsMap[mb.moduleInfo.Path].map(idx => this.connectors[idx]))
    );
  }

  drawObjects(objects: any[]) {
    objects.forEach(object => object.draw());
  }

  findModule(predicate: (box: ModuleBox) => boolean) {
    for (const box of this.boxes) {
      if (predicate(box)) {
        return box;
      }
    }
  }

  findAllModules(predicate: (box: ModuleBox) => boolean) {
    const modules: ModuleBox[] = [];

    for (const box of this.boxes) {
      if (predicate(box)) {
        modules.push(box);
      }
    }

    return modules;
  }
}

export default Visualizer;
