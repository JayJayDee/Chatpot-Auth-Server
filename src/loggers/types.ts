export interface Logger {
  info: (payload: any) => void;
  debug: (payload: any) => void;
}