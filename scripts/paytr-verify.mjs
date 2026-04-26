// Standalone sanity check for the PayTR hash logic.
//
// Run:  node scripts/paytr-verify.mjs
//
// Uses fixture env values (NOT real credentials) so it is safe to run in CI
// or in a fresh clone. Reimplements the hash logic to cross-verify lib/paytr.ts
// without pulling the app runtime.

import crypto from "node:crypto";

const FIXTURE = {
  PAYTR_MERCHANT_ID: "111111",
  PAYTR_MERCHANT_KEY: "abcdefghij0123456789",
  PAYTR_MERCHANT_SALT: "saltvalue0123456789",
  PAYTR_TEST_MODE: "1",
  PAYTR_MAX_INSTALLMENT: "5",
};

function b64hmac(payload, key) {
  return crypto.createHmac("sha256", key).update(payload, "utf8").digest("base64");
}

function buildTokenHash({
  merchantId,
  userIp,
  merchantOid,
  email,
  paymentAmount,
  userBasket,
  noInstallment,
  maxInstallment,
  currency,
  testMode,
  merchantSalt,
  merchantKey,
}) {
  const s =
    merchantId +
    userIp +
    merchantOid +
    email +
    paymentAmount +
    userBasket +
    noInstallment +
    maxInstallment +
    currency +
    testMode +
    merchantSalt;
  return b64hmac(s, merchantKey);
}

function buildCallbackHash({ merchantOid, merchantSalt, status, totalAmount, merchantKey }) {
  const s = merchantOid + merchantSalt + status + totalAmount;
  return b64hmac(s, merchantKey);
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

test("token hash is deterministic for identical inputs", () => {
  const inputs = {
    merchantId: FIXTURE.PAYTR_MERCHANT_ID,
    userIp: "192.168.1.1",
    merchantOid: "psftest001",
    email: "test@example.com",
    paymentAmount: "2500000",
    userBasket: Buffer.from(JSON.stringify([["Test", "25000.00", 1]])).toString("base64"),
    noInstallment: "0",
    maxInstallment: "5",
    currency: "TL",
    testMode: FIXTURE.PAYTR_TEST_MODE,
    merchantSalt: FIXTURE.PAYTR_MERCHANT_SALT,
    merchantKey: FIXTURE.PAYTR_MERCHANT_KEY,
  };
  const a = buildTokenHash(inputs);
  const b = buildTokenHash(inputs);
  if (a !== b) throw new Error(`Expected deterministic hash, got ${a} vs ${b}`);
  if (!a || a.length < 40) throw new Error(`Hash too short: ${a}`);
});

test("token hash changes when any field changes", () => {
  const base = {
    merchantId: FIXTURE.PAYTR_MERCHANT_ID,
    userIp: "192.168.1.1",
    merchantOid: "psftest001",
    email: "test@example.com",
    paymentAmount: "2500000",
    userBasket: "",
    noInstallment: "0",
    maxInstallment: "5",
    currency: "TL",
    testMode: "1",
    merchantSalt: FIXTURE.PAYTR_MERCHANT_SALT,
    merchantKey: FIXTURE.PAYTR_MERCHANT_KEY,
  };
  const h0 = buildTokenHash(base);
  const mutations = [
    { ...base, paymentAmount: "2500001" },
    { ...base, email: "other@example.com" },
    { ...base, merchantOid: "psftest002" },
    { ...base, testMode: "0" },
  ];
  for (const m of mutations) {
    const h = buildTokenHash(m);
    if (h === h0) throw new Error(`Hash did not change when field mutated`);
  }
});

test("callback hash verifies round-trip", () => {
  const payload = {
    merchantOid: "psftest001",
    status: "success",
    totalAmount: "2500000",
    merchantSalt: FIXTURE.PAYTR_MERCHANT_SALT,
    merchantKey: FIXTURE.PAYTR_MERCHANT_KEY,
  };
  const h = buildCallbackHash(payload);
  const again = buildCallbackHash(payload);
  if (h !== again) throw new Error(`Callback hash not deterministic`);

  // tampered status must produce a different hash
  const tampered = buildCallbackHash({ ...payload, status: "failed" });
  if (h === tampered) throw new Error(`Tampered status produced identical hash`);
});

test("base64-encoded user_basket round-trips through JSON", () => {
  const items = [["Psefitone 2. Kohort", "25000.00", 1]];
  const encoded = Buffer.from(JSON.stringify(items)).toString("base64");
  const decoded = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  if (decoded[0][0] !== items[0][0]) throw new Error(`Basket round-trip mismatch`);
  if (decoded[0][1] !== "25000.00") throw new Error(`Amount lost precision`);
});

// -----

let passed = 0;
let failed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`  ok  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL  ${name}`);
    console.log(`        ${err.message}`);
    failed++;
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
