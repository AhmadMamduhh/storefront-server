import { Product, ProductStore } from "../../models/products";


describe("ProductStore Model", () => {

    const productStore = new ProductStore();

  const dummyProductData: Product = {
      name: 'test_product',
      price: 3000
  };

  it("should return truthy value if creation of product is successful", async () => {
      const response = await productStore.create(dummyProductData)
      dummyProductData['id'] = response.id;
    expect(response).toBeTruthy();
  });

  it("should return array of products with length more than one if successful", async () => {
    const productsList = await productStore.index();
    expect(productsList.length).toBeGreaterThan(0);
  });

  it("should return a Product with the name value of 'test_product' ", async () => {
    const response = await productStore.show(dummyProductData['id'] as unknown as number)
    expect(response.name).toEqual("test_product")
  });

    it("should return modified_name value if patch is successful", async () => {
        const resp = await productStore.update({
            name: 'modified_name',
            price: 3000
        }, dummyProductData.id as unknown as number)
        
        expect(resp.name).toEqual('modified_name');

  });

  it("should return truthy value if deletion is successful", async () => {
    const deleteResponse = await productStore.delete(dummyProductData['id'] as unknown as number)

    expect(deleteResponse).toBeTruthy();

  });
});


