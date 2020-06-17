import http from 'http';

import { readFile, parseQuery, memoize } from '../utils';

const PORT = 3000;

function createServer() {
  console.log('Creating HTTP server.');
  const memoRead = memoize(readFile);

  const server = http.createServer((req, res) => {
    console.log('Got a request.');

    const filename = parseQuery(req.url).filename;
    console.log(`Responding with imports file: ${filename}`);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    res.end(memoRead(filename));
  });

  return server.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
  });
}

export default createServer;
