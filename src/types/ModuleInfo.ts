import Importer from "./Importer";

interface ModuleInfo {
  Path: string;
  IsLocal: boolean,
  Info: {
    Path: string;
    IsDir: boolean
    Importers: Importer[]
  }
}

export default ModuleInfo;
