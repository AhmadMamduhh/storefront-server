import { User, UserStore } from "../../models/user";


describe("UserStore Model", () => {

    const userStore = new UserStore();

  const dummyUserData: User = {
    username: 'mamdouh2',
    firstName: "Ahmed",
    lastName: "Mamdouh",
    password: "abc123",
  };

  it("should return truthy value if sign up is successful", async () => {
      const response = await userStore.create(dummyUserData)
      dummyUserData['id'] = response.id;
    expect(response).toBeTruthy();
  });

  it("should return truthy value if authentication is successful", async () => {
      const resp = await userStore.authenticate({
          username: 'mamdouh2',
          password: 'abc123'
    })
    expect(resp).toBeTruthy();
  });

  it("should return array of users with length more than one if successful", async () => {
    const usersList = await userStore.index();
    expect(usersList.length).toBeGreaterThan(0);
  });

  it("should return a user with the username value of 'mamdouh2' ", async () => {
    const response = await userStore.show(dummyUserData['id'] as unknown as number)
    expect(response.username).toEqual("mamdouh2")
  });

    it("should return modified username value if patch is successful", async () => {
        const resp = await userStore.update({
            username: 'modified_username',
            firstName: "Ahmed",
            lastName: "Mamdouh",
        }, dummyUserData.id as unknown as number)
        
        expect(resp.username).toEqual('modified_username');

  });

  it("should return truthy value if deletion is successful", async () => {
    const deleteResponse = await userStore.delete(dummyUserData['id'] as unknown as number)

    expect(deleteResponse).toBeTruthy();

  });
});


