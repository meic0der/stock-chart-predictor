exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();             // 自動採番のID
    table.string('username').notNullable();       // ユーザー名
    table.string('email').notNullable().unique(); // メールアドレス（重複不可）
    table.string('password').notNullable();       // ハッシュ化されたパスワード
    table.timestamp('created_at').defaultTo(knex.fn.now()); // 作成日時
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
