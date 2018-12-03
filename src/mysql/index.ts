import { injectable } from "smart-factory";
import { Modules } from '../modules';
import { MysqlConfig } from '../config/types';
import initMysql from './default-mysql-driver';
import { Logger } from '../loggers/types';

injectable(Modules.Mysql,
  [Modules.Config.MysqlConfig,
    Modules.Logger],
  async (cfg: MysqlConfig,
    logger: Logger) => await initMysql(cfg, logger));