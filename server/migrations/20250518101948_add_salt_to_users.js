exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('salt', 255);
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('salt');
  });
};
