import { ConfigSource } from './types';
import { readFileSync } from 'fs';
import { ConfigurationError } from './errors';

export default (source: ConfigSource): ConfigSource => {
  const filePath: string = source['CONFIG_FILE'];
  if (!filePath) return null;

  try {
    const fileContent = readFileSync(filePath).toString();
    return JSON.parse(fileContent);
  } catch (err) {
    throw new ConfigurationError(`configuration file path:${filePath} was invalid or not found.`);
  }
};