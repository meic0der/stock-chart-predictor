/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('favorites', function(table) {
    table.increments('id').primary();
    table.string('symbol').notNullable();
    table.timestamp('added_at').defaultTo(knex.fn.now());
    
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
  return knex.schema.dropTable('favorites');
}; 