import { app } from "../../server";
import supertest from "supertest";
import { Order } from "../../models/orders";
import { User } from "../../models/user";
import { Product } from "../../models/products";
import jsonwebtoken from 'jsonwebtoken';

const request = supertest(app);


describe("Orders Endpoints", () => {

 const testUser: User = {
    username: 'test_user',
    firstName: "Ahmed",
    lastName: "Mamdouh",
    password: "abc",
 };
    
 const dummyOrder: Order = {
    userId: 2,
    status: "active",
  };

  let dummyProductData: Product = {
    name: "test_product2",
    price: 200,
  };
    
    let token: string = "";
    
    beforeAll(async () => {
        // Creating a user to link it with the order and getting the token
      const user = await request.post("/users").send(testUser);
        token = user.body;
        const decode = jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET as string) as {id: number}
        dummyOrder['userId'] = decode['id']
        
        // Creating a product to add it to an active order
        const productResp = await request.post("/products").send(dummyProductData).set('Authorization', `Bearer ${token}`);
        dummyProductData = productResp.body;


  });

  it("tests orders creation", async () => {
    const response = await request.post("/orders").send(dummyOrder).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it("tests fetch all orders", async () => {
    const ordersList = await request.get("/orders").set('Authorization', `Bearer ${token}`);
    expect(ordersList.body.length).toBeTruthy();
  });

  it("tests get order by their ID", async () => {
    const response = await request.get("/orders/1").set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
  });
    
  it("tests adding a product to an order", async () => {
      const response = await request.post("/orders/1/products").send({
          productId: dummyProductData.id,
          quantity: 5
    }).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
  });
    
  it("tests getting the current order of the user", async () => {
    const response = await request.get(`/users/${dummyOrder.userId}/active_order`).set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
  });
    
    
   
    afterAll(async () => {
         // Deleting the created user after tests are done
        await request.delete(`/users/${dummyOrder.userId}`);

         // Deleting the created product after tests are done
         await request.delete(`/products/${dummyProductData.id}`);
      });
    

});

