import client from '../database';
import dotenv from 'dotenv';

export interface Product {
    id?: number;
    name: string;
    price: number;
}

dotenv.config();


export class ProductStore {

  async index(): Promise<Product[]> {
    try {
      const db = await client.connect();
      const query = `SELECT id, name, price FROM products;`
      const ProductsResult = await db.query(query);
      db.release();
      return ProductsResult.rows;
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const db = await client.connect();
      const query = `SELECT * FROM products WHERE id=$1;`
      const ProductsResult = await db.query(query, [id]);
      db.release();
      return ProductsResult.rows[0];
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const db = await client.connect();
      const query = `INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *;`
      const ProductsResult = await db.query(query, [product.name, product.price]);
      db.release();
      return ProductsResult.rows[0];
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const db = await client.connect();
      const query = `DELETE FROM Products WHERE id=$1;`;
      const ProductsResult = await db.query(query, [id]);
      db.release();
      return true;
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async update(product: Product, productId: number): Promise<Product> {
    try {
      const db = await client.connect();
      const query =  `UPDATE products SET name=$1, price=$2  WHERE id=$3 RETURNING *;`
      const ProductsResult = await db.query(query, [product.name, product.price, productId]);
      db.release();
      return ProductsResult.rows[0];
    } catch (err) {
      throw new Error(err as string);
    }
  }
}
