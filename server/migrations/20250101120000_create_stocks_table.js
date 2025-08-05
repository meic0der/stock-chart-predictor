exports.up = function(knex) {
  return knex.schema.createTable('stocks', function(table) {
    table.increments('id').primary();
    table.string('symbol').notNullable().unique();
    table.string('name').notNullable();
    table.string('country').notNullable();
    table.string('sector').notNullable();
    table.decimal('price', 15, 2).notNullable();
    table.decimal('raw_price', 15, 2).notNullable();
    table.decimal('pe_ratio', 10, 4);
    table.decimal('pb_ratio', 10, 4);
    table.decimal('dividend_yield', 10, 4);
    table.bigInteger('market_cap');
    table.bigInteger('volume');
    table.decimal('change', 10, 4);
    table.decimal('change_percent', 10, 4);
    table.timestamp('last_updated').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('stocks');
}; 