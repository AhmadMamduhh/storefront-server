import { app } from "../../server";
import supertest from "supertest";
import { User } from "../../models/user";

const request = supertest(app);

export let token: string = "";

describe("Users Endpoints", () => {


  const dummyUserData: User = {
    username: 'mamdouh',
    firstName: "Ahmed",
    lastName: "Mamdouh",
    password: "abc123",
  };

  it("tests user signup", async () => {
    const response = await request.post("/users").send(dummyUserData);
    token = response.body;
    expect(response.status).toBe(200);
  });

  it("tests user login/authentication", async () => {
    const resp = await request.post("/login").send({username: 'mamdouh', password: "abc123",});
    expect(resp.status).toBe(200);
    expect(resp.body).toBeTruthy();
  });

  it("tests fetch all users", async () => {
    const usersList = await request.get("/users").set(`Authorization`, "Bearer " + token);
    expect(usersList.body.length).toBeTruthy();
  });

  it("tests get user by their ID", async () => {
    const response = await request.get("/users/1").set(`Authorization`, "Bearer " + token);
    expect(response.body.username).toEqual("mamdouh")
  });

  it("tests update a user by id", async () => {
    const resp = await request.patch("/users/1").send({
      firstName: "Mohamed", lastName: 'Mamdouh',
      username: "mamdouh", password: "abc123"
    }).set(`Authorization`, "Bearer " + token);
    expect(resp.status).toBe(200);
    expect(resp.body.firstName).toEqual("Mohamed");

  });

  it("tests delete a user by id", async () => {
    const deleteResponse = await request.delete("/users/1");

    expect(deleteResponse.status).toBe(200);

  });
});


