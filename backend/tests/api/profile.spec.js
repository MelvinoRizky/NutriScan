require('dotenv').config();
const assert = require('assert');
const { supabaseAdmin } = require('../helpers/supabaseAdmin');

function buildTestEmail() {
  return `qa_${Date.now()}@example.com`;
}

describe('OP-07 Profile', () => {
  let userId;

  before(async () => {
    const testEmail = buildTestEmail();
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: 'Passw0rd!'
    });
    assert.strictEqual(error, null);
    userId = data.user.id;
  });

  it('update profile via Supabase', async () => {
    const { error } = await supabaseAdmin.from('users').upsert({
      id: userId,
      full_name: 'QA User Updated',
      height: 172,
      weight: 61,
    });
    assert.strictEqual(error, null);
  });
});
