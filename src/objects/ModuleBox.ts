import TextBox from './TextBox';
import Location from '../types/Location';
import BoxContainer from './BoxContainer';
import Dimension from '../types/Dimension';
import ModuleInfo from '../types/ModuleInfo';
import ModuleBoxOptions from '../types/ModuleBoxOptions';
import { TEXT_HEIGHT } from '../services/visualize';
import Box from './Box';

class ModuleBox extends BoxContainer {
  infoBox: TextBox
  moduleInfo: ModuleInfo;
  options: ModuleBoxOptions;
  withContentDimensions: Dimension;
  withoutContentDimensions: Dimension;

  constructor(position: Location, moduleInfo: ModuleInfo, isEntrypoint: boolean = false) {
    const pathArr = moduleInfo.Path.split('/');
    const infoBox = new TextBox(
      position,
      JSON.stringify({ IsLocal: moduleInfo.IsLocal, IsDir: moduleInfo.Info.IsDir }, null, 4)
    );

    super(
      infoBox,
      pathArr[pathArr.length - 1],
      isEntrypoint ? { background: "#f00" } : null
    );
    this.infoBox = infoBox;
    this.moduleInfo = moduleInfo;
    this.withContentDimensions = Object.assign({}, this.dimensions);
    this.withoutContentDimensions = {
      height: this.textHeight + TEXT_HEIGHT,
      width: this.textWidth + TEXT_HEIGHT * 4
    }

    this.setOptions({ showContent: false });
  }

  setOptions(options: ModuleBoxOptions) {
    this.options = {
      ...this.options || {},
      ...options
    }

    this.applyOptions();
  }

  applyOptions() {
    if (this.options.showContent) {
      this.dimensions = this.withContentDimensions;
      this.vertices = Box.getBoxVertices(this);

      return
    }

    this.dimensions = this.withoutContentDimensions;
    this.vertices = Box.getBoxVertices(this);
  }


  drawContent() {
    if (this.options.showContent) {
      this.infoBox.draw();
    }
  }

  draw() {
    this.drawContent()
    super.draw();
  }
}

export default ModuleBox;
