import fs from 'fs';

export function readFile(file: string) {
  return fs.readFileSync(file).toString();
}

export function optArg(flag: string, value: string) {
  return `${value ? flag + value : ''}`;
}

export function parseQuery(url: string): { [key: string]: string } {
  const queryArr = url.trim().split('&');

  return queryArr.reduce((acc, query) => {
    const [key, value] = query.split('=');

    acc[key.replace(/^\S*\?/, '')] = value;

    return acc;
  }, {} as any);
}