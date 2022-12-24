import { Order, OrderStore } from "../../models/orders";
import { Product, ProductStore } from "../../models/products";
import { User, UserStore } from "../../models/user";


const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

const dummyUserData: User = {
    username: 'mamdouh2',
    firstName: "Ahmed",
    lastName: "Mamdouh",
    password: "abc123",
};

const dummyOrderData: Order = {
    userId: 1,
    status: 'active'
};

const dummyProductData: Product = {
    name: 'test_product',
    price: 5000
};

describe("OrderStore Model", () => {

    beforeAll(async () => {

        // Create user to link it with order
        const user = await userStore.create(dummyUserData)

        // Link user with order
        dummyOrderData['userId'] = user.id as unknown as number;

        // Create product to add it to the order
        const product = await productStore.create(dummyProductData)
        dummyProductData['id'] = product.id;

 }) 

  it("should return truthy value if creation of order is successful", async () => {
      const response = await orderStore.create(dummyOrderData)
      dummyOrderData['id'] = response.id;
    expect(response).toBeTruthy();
  });

  it("should return array of orders with length more than one if successful", async () => {
    const ordersList = await orderStore.index();
    expect(ordersList.length).toBeGreaterThan(0);
  });

  it("should return a Order with the ID equal to the ID of the dummyOrders object ", async () => {
    const response = await orderStore.show(dummyOrderData['id'] as unknown as number)
    expect(response.id).toEqual(dummyOrderData['id'])
  });

    it("should return the status of the order to be complete", async () => {
        const resp = await orderStore.update({
            userId: dummyOrderData['userId'],
            status: 'complete'
        }, dummyOrderData.id as unknown as number)
        
        expect(resp.status).toEqual('complete');

    });
    
    it("should return truthy value if product is added to order", async () => {
        const resp = await orderStore.addProductToOrder({
            orderId: dummyOrderData['id'] as unknown as number,
            productId: dummyProductData['id'] as unknown as number,
            quantity: 5
        },)
        
        expect(resp).toBeTruthy();

  });

  it("should return truthy value if deletion is successful", async () => {
    const deleteResponse = await orderStore.delete(dummyOrderData['id'] as unknown as number)

    expect(deleteResponse).toBeTruthy();

  });
    
  afterAll(async () => {
    // Deleted the created user when we're done
    await userStore.delete(dummyUserData['id'] as unknown as number)
  })
    
});


