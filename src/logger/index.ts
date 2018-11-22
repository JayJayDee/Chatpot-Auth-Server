import { Logger } from './types';

const defaultLogger = (): Logger => ({
  info: console.log,
  debug: console.log,
  error: console.error
});
export default defaultLogger;

export {
  Logger
} from './types';