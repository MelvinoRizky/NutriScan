require('dotenv').config();
const assert = require('assert');
const { supabaseAdmin } = require('../helpers/supabaseAdmin');

function buildTestEmail() {
  return `qa_${Date.now()}@example.com`;
}

describe('OP-04 + OP-06 History', () => {
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

  it('OP-04 insert food_logs', async () => {
    const { error } = await supabaseAdmin.from('food_logs').insert({
      user_id: userId,
      food_name: 'Nasi Goreng',
      calories: 450,
      protein: 12,
      carbs: 58,
      fat: 18,
      meal_type: 'lunch',
      ai_confidence: 90,
      logged_at: new Date().toISOString(),
    });
    assert.strictEqual(error, null);
  });

  it('OP-06 load history', async () => {
    const { data, error } = await supabaseAdmin
      .from('food_logs')
      .select('*')
      .eq('user_id', userId);
    assert.strictEqual(error, null);
    assert.ok(Array.isArray(data));
  });
});
