import TextBox from './TextBox';
import Location from '../types/Location';
import BoxContainer from './BoxContainer';
import ModuleInfo from '../types/ModuleInfo';

class ModuleBox extends BoxContainer {
  infoBox: TextBox;
  moduleInfo: ModuleInfo;

  constructor(position: Location, moduleInfo: ModuleInfo, isEntrypoint: boolean = false) {
    const pathArr = moduleInfo.Path.split('/');
    const infoBox = new TextBox(
      position,
      `IsLocal -> ${moduleInfo.IsLocal}\nImported By ${moduleInfo.Info.Importers.length} modules${
      moduleInfo.Info.ImportsCount ? `\nImports ${moduleInfo.Info.ImportsCount} modules directly` : ''
      }`);

    super(infoBox, pathArr[pathArr.length - 1], isEntrypoint ? { background: '#f00' } : null);
    this.infoBox = infoBox;
    this.moduleInfo = moduleInfo;
  }

  draw() {
    this.infoBox.draw();
    super.draw();
  }
}

export default ModuleBox;
