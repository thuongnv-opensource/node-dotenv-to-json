const { parse } = require('dotenv');

const readAll = (stream: typeof process.stdin): Promise<string> => {
  return new Promise((resolve, reject) => {
    let buffer = '';
    stream.setEncoding('utf8');
    stream.on('readable', () => {
      while (true) {
        const chunk = stream.read();
        if (chunk === null) break;
        buffer += chunk;
      }
    });
    stream.on('end', () => void resolve(buffer));
    stream.on('error', (error) => void reject(error));
  });
};

const envToJson = (env: string): string => JSON.stringify(parse(env));

const toEnvK8s = (env: string): string => {
  const p = parse(env);
  const result = []
  Object.keys(p).forEach((key:string)=>{
     result.push({name:key,value:p[key]})
  })
  return result
};

const run = (): void => {
  readAll(process.stdin)
    .then((env) => toEnvK8s(env))
    .then((out) => void process.stdout.write(out));
};

export { run };
