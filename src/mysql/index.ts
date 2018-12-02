import { injectable } from "smart-factory";
import { Modules } from '../modules';
import { MysqlConfig } from '../config/types';
import initMysql from './default-mysql-driver';

injectable(Modules.Mysql,
  [Modules.Config.MysqlConfig],
  async (cfg: MysqlConfig) => await initMysql(cfg));