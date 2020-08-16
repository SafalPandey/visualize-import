import TextBox from './TextBox';
import Location from '../types/Location';
import BoxContainer from './BoxContainer';
import ModuleInfo from '../types/ModuleInfo';

class ModuleBox extends BoxContainer {
  infoBox: TextBox;
  moduleInfo: ModuleInfo;

  constructor(position: Location, moduleInfo: ModuleInfo) {
    const pathArr = moduleInfo.Path.split('/');
    const baseName = pathArr.pop();
    const moduleName = baseName.startsWith('index.') ? pathArr.pop() + '/' : baseName;
    const infoBox = new TextBox(
      position,
      [
        `IsLocal -> ${moduleInfo.IsLocal}`,
        `Imported By ${moduleInfo.Info.Importers?.length || 0} modules`,
        `Imports ${moduleInfo.Info.Imports?.length || 0} modules directly`
      ].join('\n')
    );

    super(infoBox, moduleName, moduleInfo.IsEntrypoint ? { background: '#f00' } : null);
    this.infoBox = infoBox;
    this.moduleInfo = moduleInfo;
  }

  draw() {
    this.infoBox.draw();
    super.draw();
  }
}

export default ModuleBox;
