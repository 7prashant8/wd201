/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require('cheerio');
const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
   var $ = cheerio.load(res.text);
   return $("[name = _csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {console.log('Started an Express application at port 3000')});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstname: "Test",
      lastname: "User 1",
      email: "user.1@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
    res = await agent.post("/users").send({
      firstname: "Test",
      lastname: "User 2",
      email: "user.2@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  


  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "user.1@test.com", "12345678");
    const res = await agent.get('/todos');
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf" : csrfToken
    });
    expect(response.statusCode).toBe(302);
    
    
  });

  test("Marks a todo with the given ID as complete or incomplete", async () => {
    const agent = request.agent(server);
    await login(agent, "user.1@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      // eslint-disable-next-line quote-props
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const completeResponse = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf : csrfToken,
      completed: false,
    });
    const parseUpdateResponse = JSON.parse(completeResponse.text);
    expect(parseUpdateResponse.completed).toBe(true);
    const incompleteResponse = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf : csrfToken,
      completed: true,
    });
    const parseResponse = JSON.parse(incompleteResponse.text);
    expect(parseResponse.completed).toBe(false);

  });

  

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    // FILL IN YOUR CODE HERE
    const agent = request.agent(server);
    // eslint-disable-next-line no-undef
    await login(agent, "user.1@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
        title: "Go to market",
        dueDate: new Date().toISOString(),
        completed: false,
        "_csrf" : csrfToken,
      });

      const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
      const parsedResponse = JSON.parse(groupedTodosResponse.text);
      const todoID = parsedResponse.allTodos[0].id;
  
      const deleteTodoResponse = await agent.delete(`/todos/${todoID}`).send({
        "_csrf" : csrfToken,
      });
      const parsedDeleteResponse = JSON.parse(deleteTodoResponse.text);
      
      expect(parsedDeleteResponse).toBe(true);
  });

  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("To verify usera cannot update or delete userb's todo list",async () =>{
    const userA = request.agent(server);
    await login(userA, "user.1@test.com", "12345678");
    let res = await userA.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await userA.post("/todos").send({
      title: "first user todo",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    await userA.post("/todos").send({
      title: "first user todo2",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    let groupedTodosResponse = await userA
      .get("/todos")
      .set("Accept", "application/json");
    let parsedGroupedResponseuserA = JSON.parse(groupedTodosResponse.text);
    let dueTodayCount = parsedGroupedResponseuserA.dueToday.length;
    const firstUserLatestTodo = parsedGroupedResponseuserA.dueToday[dueTodayCount - 1];
    const updateResponse = await userA.put(`/todos/${firstUserLatestTodo.id}`).send({
      _csrf : csrfToken,
      completed: false});
     await userA.delete(`/todos/${firstUserLatestTodo.id}`).send({
        _csrf : csrfToken,
        completed: false});
     groupedTodosResponse = await userA
        .get("/todos")
        .set("Accept", "application/json");
        parsedGroupedResponseuserA = JSON.parse(groupedTodosResponse.text);
    dueTodayCount = parsedGroupedResponseuserA.dueToday.length;
    const parsedupdateResponseuserA = JSON.parse(updateResponse.text);
    //const parseddeleteResponseuserA = JSON.parse(deleteResponse.text);
    const userB = request.agent(server);
    await login(userB, "user.2@test.com", "12345678");

    res = await userB.get("/todos");
    csrfToken = extractCsrfToken(res);
      await userB.post("/todos").send({
        title: "userB todo",
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken,
      });
      await userB.post("/todos").send({
        title: "userB todo2",
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken,
      });
      const groupedTodosResponseuserB = await userB
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponseuserB = JSON.parse(groupedTodosResponseuserB.text);
    const dueTodayCountuserB = parsedGroupedResponseuserB.dueToday.length;
    const UserBLatestTodo = parsedGroupedResponseuserB.dueToday[dueTodayCountuserB - 1];
    expect(dueTodayCount).toBe(3);
    expect(dueTodayCountuserB).toBe(2);
    expect(parsedupdateResponseuserA.completed).toBe(true);
    expect(UserBLatestTodo.completed).toBe(false);
    
  });
  
});
