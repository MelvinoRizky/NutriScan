require('dotenv').config();
const assert = require('assert');
const request = require('supertest');
const { supabaseAdmin } = require('../helpers/supabaseAdmin');

const apiUrl = process.env.API_URL || 'http://localhost:3000';

function buildTestEmail() {
  return `qa_${Date.now()}@example.com`;
}

describe('OP-01 Auth + OP-08 Logout', () => {
  let testEmail;
  const testPassword = 'Passw0rd!';
  let userId;

  before(() => {
    testEmail = buildTestEmail();
  });

  it('OP-01 registrasi via backend', async () => {
    const res = await request(apiUrl)
      .post('/register')
      .send({
        email: testEmail,
        password: testPassword,
        nama: 'QA User',
        usia: 21,
        gender: 'Laki-laki',
        tinggi: 170,
        berat: 60,
        target: 'Jaga Berat Badan',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  it('OP-01 login (cek user ada di Supabase)', async () => {
    const { data, error } = await supabaseAdmin.auth.admin.getUserByEmail(testEmail);
    assert.strictEqual(error, null);
    assert.ok(data && data.user && data.user.id);
    userId = data.user.id;
  });

  it('OP-08 logout (revoke session)', async () => {
    const { error } = await supabaseAdmin.auth.admin.signOut(userId);
    assert.strictEqual(error, null);
  });
});
