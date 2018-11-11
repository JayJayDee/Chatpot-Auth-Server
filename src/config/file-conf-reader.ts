import { ConfigSource } from './types';
import { ConfigurationError } from './errors';

export type Reader = (path: string) => Buffer;

export default (source: ConfigSource, read: Reader): ConfigSource => {
  const filePath: string = source['CONFIG_FILE'];
  if (!filePath) return null;

  try {
    const fileContent = read(filePath).toString();
    return JSON.parse(fileContent);
  } catch (err) {
    throw new ConfigurationError(`configuration file path:${filePath} was invalid or not found.`);
  }
};