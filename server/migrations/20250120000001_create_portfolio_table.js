/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('portfolio', function(table) {
    table.increments('id').primary();
    table.string('symbol').notNullable();
    table.integer('shares').notNullable();
    table.decimal('purchase_price', 10, 2).notNullable();
    table.timestamp('purchase_date').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // 外部キー制約
    table.foreign('symbol').references('symbol').inTable('stocks').onDelete('CASCADE');
    
    // ユニーク制約（同じ銘柄は複数回登録できない）
    table.unique(['symbol']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('portfolio');
}; 