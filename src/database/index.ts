import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_PASSWORD,
  ENV,
} = process.env;

const client = new Pool({
  host: POSTGRES_HOST,
  user: POSTGRES_USER,
  database: ENV === 'dev' ? POSTGRES_DB : POSTGRES_DB_TEST,
  password: POSTGRES_PASSWORD,
});

export default client;
