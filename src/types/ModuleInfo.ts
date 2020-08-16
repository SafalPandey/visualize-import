import Importer from './Importer';

interface ModuleInfo {
  Path: string;
  IsLocal: boolean;
  Info: {
    Path: string;
    IsDir: boolean;
    ImportsCount?: number;
    Importers: Importer[];
  };
}

export default ModuleInfo;
