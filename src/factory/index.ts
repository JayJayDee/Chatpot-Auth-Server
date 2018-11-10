
import initMysql from '../mysql';
import { RootConfig } from '../config';

export const mysql = async () => {

};

export default async (rootConfig: RootConfig) => {
  await initMysql(rootConfig.mysql);
};