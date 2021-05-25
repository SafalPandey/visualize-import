import path from 'path';
import http from 'http';

import { parseQuery, readFileAsStream } from '../utils';
import { SERVER_PORT, HTML_SERVER_PORT } from '../constants';

const basePath = path.join(__dirname, '..', '..');
export const FRONTEND_SERVER_URL = `http://localhost:${HTML_SERVER_PORT}`;

export const FRONTEND_URL_TO_FILE_MAP: { [key: string]: string } = {
  '/': path.join(basePath, 'index.html'),
  '/style.css': path.join(basePath, 'style.css'),
  '/dist/main.js': path.join(basePath, 'dist', 'main.js')
};

export function createServer() {
  console.log('Creating HTTP server.');

  const server = http.createServer((req, res) => {
    console.log('Got a request.');
    const filename = parseQuery(req.url).filename;

    console.log(`Responding with imports file: ${filename}`);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    });

    const stream = readFileAsStream(filename);
    stream.pipe(res);
  });

  return server.listen(SERVER_PORT, () => {
    console.log(`Listening on Port: ${SERVER_PORT}`);
  });
}

export function createHtmlServer() {
  console.log('Creating file server.');

  const server = http.createServer((req, res) => {
    console.log('Got a request.', req.url);

    const filename: string = FRONTEND_URL_TO_FILE_MAP[req.url];

    if (!filename) {
      return res.writeHead(400).end();
    }

    console.log(`Responding with file: ${filename}`);
    res.writeHead(200, {
      'Content-Type': `text/${filename.split('.').pop()}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    });

    const stream = readFileAsStream(filename);
    stream.pipe(res);
  });

  return server.listen(HTML_SERVER_PORT, () => {
    console.log(`Listening on Port: ${HTML_SERVER_PORT}`);
  });
}
