import { injectable } from 'smart-factory';
import { PageModules } from './modules';
import { LoggerModules, LoggerTypes } from '../loggers';
import { PageTypes } from './types';

const tag = '[ejs-registerer]';

injectable(PageModules.PagesRegisterer,
  [ LoggerModules.Logger ],
  async (log: LoggerTypes.Logger): Promise<PageTypes.PagesRegisterer> =>

    (app) => {
      const path = __dirname;
      app.set('views', path);
      app.set('view engine', 'ejs');
      log.debug(`${tag} ejs regisetered, view-path: ${path}`);
    });