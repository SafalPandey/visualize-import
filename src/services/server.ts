import http from 'http';

import { readFile, parseQuery } from '../utils';

function createServer() {
  const server = http.createServer((req, res) => {
    console.log('Got a request.');

    const filename = parseQuery(req.url).filename;
    console.log(`Responding with imports file: ${filename}`);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    res.end(readFile(filename));
  });

  return server.listen(3000);
}

export default createServer;
