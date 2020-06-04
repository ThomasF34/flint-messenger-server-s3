import { config } from 'dotenv';
import * as defaultConfig from '../config.json';

config();

export interface IConfig {
  PORT: number;
  mongo_host: string;
  mongo_user: string;
  mongo_pass: string;
  mongo_database: string;
  mongo_debug: boolean;
  session_secret: string;
}

export function configuration(): IConfig {
  const result: any = { ...defaultConfig };
  for (const key in result) {
    if (key in process.env) result[key] = process.env[key];
  }
  return result;
}
