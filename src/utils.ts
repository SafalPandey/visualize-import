import fs from 'fs';

export function readFile(file: string) {
  console.log(`Reading file: ${file}`);

  return fs.readFileSync(file).toString();
}

export function memoize(func: (...args: any[]) => any) {
  const retMap = new Map();

  return (...args: any[]) => {
    const key = `${func.name}-${args.join('-')}`;

    if (!retMap.has(key)) {
      retMap.set(key, func(...args));
    }

    return retMap.get(key);
  };
}

export function optArg(flag: string, value: string) {
  return `${value ? `${flag} ${value}` : ''}`;
}

export function parseQuery(url: string): { [key: string]: string } {
  const queryArr = url.trim().split('&');

  return queryArr.reduce((acc, query) => {
    const [key, value] = query.split('=');

    acc[key.replace(/^\S*\?/, '')] = decodeURI(value);

    return acc;
  }, {} as any);
}

export function parseArg(args: string[], flag: string): string {
  const flagIndex = args.indexOf(flag);

  if (flagIndex === -1) {
    return null;
  }

  return args[flagIndex + 1];
}
