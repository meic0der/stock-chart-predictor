exports.up = function(knex) {
  return knex.schema.table('stocks', function(table) {
    table.decimal('dividend', 10, 4).defaultTo(0); // 配当金カラムを追加
  });
};

exports.down = function(knex) {
  return knex.schema.table('stocks', function(table) {
    table.dropColumn('dividend');
  });
}; 