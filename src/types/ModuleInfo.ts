import Importer from './Importer';

interface ModuleInfo {
  Path: string;
  IsLocal: boolean;
  IsEntrypoint: boolean;
  Info: {
    Path: string;
    IsDir: boolean;
    Imports: null | string[];
    Importers: null | Importer[];
  };
}

export default ModuleInfo;
