import client from '../database';
import dotenv from 'dotenv';

export interface Order {
    id?: number;
    status: 'active' | 'complete';
    userId: number;
}

dotenv.config();


export class OrderService {


  async getUserCurrentOrder(userId: number): Promise<Order> {
    try {
     const db = await client.connect();
    const query = `SELECT * FROM orders WHERE user_id=$1 AND status=$2;`
    const ordersResult = await db.query(query, [userId, "active"]);
    db.release();
    if(ordersResult.rows.length)
        return ordersResult.rows[0];
    else
        throw new Error("404 - this user has no current order");
    } catch (err) {
        throw new Error(err as string);
    }
  }
}
