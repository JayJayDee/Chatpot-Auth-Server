import { Application } from 'express';

export namespace PageTypes {
  export type PagesRegisterer = (app: Application) => void;
}