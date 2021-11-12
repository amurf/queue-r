const supertest = require("supertest");
const serverInit = require("../src/server.js");

let _app;
let request;

beforeAll((done) => {
  serverInit().then((app) => {
    _app = app;
    request = supertest(app);
  });
});

afterAll((done) => {
  _app.close(done);
});

describe("QR Endpoint", () => {
  it("GET /qr/some-id-here should return valid QR code", async () => {
    request
      .get("/qr/some-id-here")
      .expect("Content-Type", "application/octet-stream")
      .expect(200);
  });
});
