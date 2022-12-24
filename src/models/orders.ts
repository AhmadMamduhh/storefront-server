import client from '../database';

export interface Order {
    id?: number;
    status: 'active' | 'complete';
    userId: number;
}

export interface OrderProduct {
  id?: number;
  quantity: number;
  productId: number;
  orderId: number;
};


export class OrderStore {

  async index(): Promise<Order[]> {
    try {
      const db = await client.connect();
      const query = `SELECT id, status, user_id FROM orders;`
      const ordersResult = await db.query(query);
      db.release();
      return ordersResult.rows;
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const db = await client.connect();
      const query = `SELECT * FROM orders WHERE id=$1;`
      const ordersResult = await db.query(query, [id]);
      db.release();
      return ordersResult.rows[0];
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const db = await client.connect();
      const query = `INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *;`
      console.log(order)
      const ordersResult = await db.query(query, [order.status, order.userId]);
      db.release();
      return ordersResult.rows[0];
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const db = await client.connect();
      const query = `DELETE FROM orders WHERE id=$1;`;
      const ordersResult = await db.query(query, [id]);
      db.release();
      return true;
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async update(order: Order, orderId: number): Promise<Order> {
    try {
      const db = await client.connect();
      const query =  `UPDATE orders SET status=$1, user_id=$2  WHERE id=$3 RETURNING *;`
      const ordersResult = await db.query(query, [order.status, order.userId, orderId]);
      db.release();
      return ordersResult.rows[0];
    } catch (err) {
      throw new Error(err as string);
    }
  }

  async addProductToOrder(orderProduct: OrderProduct): Promise<OrderProduct> {
    try {
        const db = await client.connect();
        const query = "INSERT INTO orders_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *";
        const result = await db.query(query, [
          orderProduct.orderId,
          orderProduct.productId,
          orderProduct.quantity,
        ]);
        db.release();
        return result.rows[0];
    }
    
    catch (err) {
      throw new Error("Could not add product to order");
    }
  }

}
