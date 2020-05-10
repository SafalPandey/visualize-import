import open from 'open';
import path from 'path';

import { parseArg } from './utils';
import createServer from './services/server';
import parseImport, { shouldParse } from './services/parseImport';

const DEFAULT_OUTPUT_FILENAME = './imports.json';
const INDEX_FILE_URL = `file://${path.join(process.cwd(), 'index.html')}`;

async function main() {
  if (shouldParse()) {
    parseImport(parseArg(process.argv, '-f'), {
      tsconfig: parseArg(process.argv, '-tsconfig'),
      language: parseArg(process.argv, '-l') || 'ts',
      entrypoint: parseArg(process.argv, '-entry-point'),
      outputFileName: parseArg(process.argv, '-o') || DEFAULT_OUTPUT_FILENAME,
    });
  }

  const server = createServer();

  console.log('Visualizing imports', INDEX_FILE_URL);
  await open(INDEX_FILE_URL, { app: 'firefox', wait: true, url: true });

  server.close();
}

(async () => {
  await main();
})();
