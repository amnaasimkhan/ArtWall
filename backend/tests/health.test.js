// Smoke tests run by CI before any image is built or deployed.
// They start the Express app on a random port without needing a database.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";

process.env.STRIPE_SECRET_KEY ||= "sk_test_dummy";
process.env.JWT_SECRET_KEY ||= "test-secret";
process.env.DB_HOST ||= "127.0.0.1";
process.env.DB_PORT ||= "1"; // nothing listens here: DB checks must fail fast

const { default: app } = await import("../app.js");
let server, base;

before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

test("GET /health returns 200", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, "ok");
});

test("GET /health/db reports 503 when the database is unreachable", async () => {
  const res = await fetch(`${base}/health/db`);
  assert.equal(res.status, 503);
});

test("unknown routes return 404", async () => {
  const res = await fetch(`${base}/definitely-not-a-route`);
  assert.equal(res.status, 404);
});
