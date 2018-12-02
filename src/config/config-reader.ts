import { readFile } from 'fs';
import { ConfigSource, ConfigReader } from "./types";
import { ConfigurationError } from './errors';

const read = (src: ConfigSource): ConfigReader =>
  async () => {
    const configPath = src['CONFIG_FILE'];
    if (!configPath) return src;
    return await readFileContent(configPath);
  };
export default read;

export const readFileContent = (path: string) =>
  new Promise((resolve, reject) => {
    readFile(path, ((err, data) => {
      if (err) return reject(new ConfigurationError(`unable to read config file: ${path}`));
      try {
        const content = JSON.parse(data.toString());
        resolve(content);
      } catch (err) {
        return reject(new ConfigurationError(`invalid config file: ${path}`));        
      }
    }));
  });