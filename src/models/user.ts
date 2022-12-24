import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

export interface User {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserAuth {
  username: string;
  password: string;
}

export interface PatchUser{
  username: string;
  firstName: string;
  lastName: string;
}

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD_PEPPER;
const saltRounds = process.env.SALT_ROUNDS;

export class UserStore {

  async index(): Promise<User[]> {
    try {
      const db = await client.connect();
      const query = `SELECT id, user_name, first_name, last_name FROM users;`
      const UsersResult = await db.query(query);
      db.release();
      return UsersResult.rows.map((dbUser) => ({
        id: dbUser.id,
        username: dbUser.user_name,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        password: dbUser.password_digest
      }))
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const db = await client.connect();
      const query = `SELECT id, user_name, first_name, last_name FROM users WHERE id=$1;`
      const UsersResult = await db.query(query, [id]);
      db.release();
      const dbUser = UsersResult.rows[0]
      return {
        id: dbUser.id,
        username: dbUser.user_name,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        password: dbUser.password_digest
      };
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const db = await client.connect();
      const hashedPassword = bcrypt.hashSync(
        user.password + pepper,
        Number(saltRounds)
      );
      const query = `INSERT INTO users (user_name, first_name, last_name, password_digest) VALUES ($1, $2, $3, $4) RETURNING id, user_name, first_name, last_name;`
      const UsersResult = await db.query(query, [user.username, user.firstName, user.lastName, hashedPassword]);
      db.release();
      const dbUser = UsersResult.rows[0]
      return      {
        id: dbUser.id,
        username: dbUser.user_name,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        password: dbUser.password_digest
      };
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const db = await client.connect();
      const query = `DELETE FROM users WHERE id=$1;`;
      const UsersResult = await db.query(query, [id]);
      db.release();
      return true;
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async update(user: PatchUser, userId: number): Promise<User> {
    try {
      const db = await client.connect();
      const query =  `UPDATE users SET user_name=$1, first_name=$2, last_name=$3 WHERE id=$4 RETURNING id, user_name, first_name, last_name;`
      const UsersResult = await db.query(query, [user.username, user.firstName, user.lastName, userId]);
      db.release();
      const dbUser = UsersResult.rows[0]
      return      {
        id: dbUser.id,
        username: dbUser.user_name,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        password: dbUser.password_digest
      };
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async authenticate(user: UserAuth): Promise<User | null> {
    try {
      const db = await client.connect();
      const query = `SELECT * FROM users WHERE user_name=$1;`
      const UsersResult = await db.query(query, [user.username]);
      db.release();
      if (UsersResult.rows.length) {
        const userDb = UsersResult.rows[0];
        const compareResult = bcrypt.compareSync(
          user.password + pepper,
          userDb.password_digest
        );
        if (compareResult)
          return {
            id: userDb.id,
            username: userDb.username,
            firstName: userDb.first_name,
            lastName: userDb.last_name,
            password: userDb.password_digest,
          };
      }
      return null;
    } catch (err) {
      throw new Error(err as string);
    }
  }
}
