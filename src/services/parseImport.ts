import { execSync } from 'child_process';

import { optArg } from '../utils';
import ParseImportParams from '../types/ParseImportParams';

function parseImport(filename: string, opts?: ParseImportParams) {
  let { tsconfig, entrypoint, language, outputFileName } = opts;

  return execSync(
    `npx parse-import -f ${filename} ${optArg('-l', language)} ${optArg('-tsconfig', tsconfig)} ${optArg(
      '-entry-point',
      entrypoint
    )} -o ${outputFileName} -no-indent`
  );
}

export function shouldParse() {
  return process.argv.indexOf('-parse') !== -1;
}

export default parseImport;
