import { app } from "../../server";
import supertest from "supertest";
import { token } from "./01-users.spec";
import { Product } from "../../models/products";

const request = supertest(app);

describe("Users Endpoints", () => {


  const dummyProductData: Product = {
    name: "test_product",
    price: 200,
  };

  it("tests products creation", async () => {
    const response = await request.post("/products").send(dummyProductData).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it("tests fetch all products", async () => {
    const productsList = await request.get("/products");
    expect(productsList.body.length).toBeTruthy();
  });

  it("tests get product by their ID", async () => {
    const response = await request.get("/products/1");
    expect(response.body.name).toEqual("test_product")
  });

});

