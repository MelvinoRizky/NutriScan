require('dotenv').config();
const assert = require('assert');
const path = require('path');
const request = require('supertest');

const apiUrl = process.env.API_URL || 'http://localhost:3000';
const fixtureImage = path.join(__dirname, '..', 'fixtures', 'test_food.jpg');

describe('OP-02 + OP-03 Scan', () => {
  it('scan gambar via API', async () => {
    const res = await request(apiUrl)
      .post('/scan')
      .attach('photo', fixtureImage);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.result && res.body.result.name);
  });
});
