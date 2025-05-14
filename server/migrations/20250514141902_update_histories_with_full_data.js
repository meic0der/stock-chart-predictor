exports.up = function (knex) {
  return knex.schema.alterTable('histories', (table) => {
    table.specificType('actual', 'float8[]');
    table.specificType('actualDates', 'text[]');
    table.specificType('predictedDates', 'text[]');
    table.jsonb('company');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('histories', (table) => {
    table.dropColumn('actual');
    table.dropColumn('actualDates');
    table.dropColumn('predictedDates');
    table.dropColumn('company');
  });
};
