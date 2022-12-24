import { Order, OrderStore } from "../../models/orders";
import { User, UserStore } from "../../models/user";
import { OrderService } from "../../services/orders";


const orderStore = new OrderStore();
const userStore = new UserStore();
const userOrderService = new OrderService();

const dummyUserData: User = {
    username: 'mamdouh3',
    firstName: "Ahmed",
    lastName: "Mamdouh",
    password: "abc123",
};

const dummyOrderData: Order = {
    userId: 1,
    status: 'active'
};


describe("OrderStore Model", () => {

    beforeAll(async () => {

        // Create user to link it with order
        const user = await userStore.create(dummyUserData)
        dummyUserData['id'] = user.id;

        // Link user with order
        dummyOrderData['userId'] = user.id as unknown as number;

        // Create Order
       await orderStore.create(dummyOrderData);

 }) 

  it("should return truthy value and an order with an active status if successful", async () => {
      const response = await userOrderService.getUserCurrentOrder(dummyUserData['id'] as unknown as number)
      expect(response).toBeTruthy();
      expect(response.status).toEqual('active')
  });
    
    afterAll(async () => {
        // Deleted the created user when we're done
        await userStore.delete(dummyUserData['id'] as unknown as number)
    })
});


