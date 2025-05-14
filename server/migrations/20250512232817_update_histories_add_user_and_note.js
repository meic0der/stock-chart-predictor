exports.up = function (knex) {
  return knex.schema.alterTable('histories', function (table) {
    table.integer('user_id').defaultTo(1); // 仮のユーザー
    table.string('note').nullable();
    table.unique(['symbol', 'user_id']); // 重複防止
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('histories', function (table) {
    table.dropUnique(['symbol', 'user_id']);
    table.dropColumn('user_id');
    table.dropColumn('note');
  });
};

