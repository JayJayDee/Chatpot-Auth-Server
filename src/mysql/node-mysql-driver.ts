import { MysqlDriver } from "./types";

const nodeMysqlDriver: MysqlDriver = {
  async query(query: string, params: any[]) {
    return [];
  }
};

export default nodeMysqlDriver;