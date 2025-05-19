/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
// migration file (例: add_range_and_model_to_histories.js)
exports.up = function (knex) {
  return knex.schema.table('histories', function (table) {
    table.string('range');
    table.string('model');
  });
};

exports.down = function (knex) {
  return knex.schema.table('histories', function (table) {
    table.dropColumn('range');
    table.dropColumn('model');
  });
};
