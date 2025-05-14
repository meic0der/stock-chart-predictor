exports.up = function (knex) {
  return knex.schema.createTable('histories', function (table) {
    table.increments('id').primary();
    table.string('symbol').notNullable();
    table.jsonb('predicted').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('histories');
};
