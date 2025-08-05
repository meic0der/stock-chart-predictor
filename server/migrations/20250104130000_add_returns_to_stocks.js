exports.up = function(knex) {
  return knex.schema.table('stocks', function(table) {
    table.decimal('annual_return', 10, 4);
    table.decimal('volatility', 10, 4);
  });
};

exports.down = function(knex) {
  return knex.schema.table('stocks', function(table) {
    table.dropColumn('annual_return');
    table.dropColumn('volatility');
  });
}; 