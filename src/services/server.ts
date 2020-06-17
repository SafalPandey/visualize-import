import http from 'http';

import { SERVER_PORT } from '../constants';
import { readFile, parseQuery, memoize } from '../utils';

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

  return server.listen(SERVER_PORT, () => {
    console.log(`Listening on Port: ${SERVER_PORT}`);
  });
}

export default createServer;
