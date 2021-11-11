const supertest = require("supertest");
const server = require("../src/server.js");

let app;
let request;

beforeAll((done) => {
  app = server.listen(done);
  request = supertest(app);
});

afterAll((done) => {
  app.close(done);
});

describe("QR Endpoint", () => {
  it("GET /qr/some-id-here should return valid QR code", async () => {
    request
      .get("/qr/some-id-here")
      .expect("Content-Type", "application/octet-stream")
      .expect(200);
  });
});
