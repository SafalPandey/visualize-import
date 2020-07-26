import open from 'open';

import { parseArg } from './utils';
import parseImport, { shouldParse } from './services/parseImport';
import { createServer, createHtmlServer, FRONTEND_SERVER_URL } from './services/server';

const DEFAULT_OUTPUT_FILENAME = './imports.json';

async function main() {
  if (shouldParse()) {
    parseImport(parseArg(process.argv, '-f'), {
      tsconfig: parseArg(process.argv, '-tsconfig'),
      language: parseArg(process.argv, '-l') || 'ts',
      entrypoint: parseArg(process.argv, '-entry-point'),
      outputFileName: parseArg(process.argv, '-o') || DEFAULT_OUTPUT_FILENAME,
    });
  }

  createServer();
  createHtmlServer();

  console.log('Visualizing imports', INDEX_FILE_URL);
  await open(INDEX_FILE_URL, { app: 'firefox', wait: true, url: true });

  server.close();
}

(async () => {
  await main();
})();
