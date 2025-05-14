// migrations/XXXXXXXX_change_predicted_to_float_array.js

exports.up = async function (knex) {
  // 🔥 1. 既存データを消す（バックアップしたいなら別処理）
  await knex('histories').update({ predicted: null });

  // 🔧 2. 一度カラムを削除してから追加し直す
  await knex.schema.alterTable('histories', (table) => {
    table.dropColumn('predicted');
  });

  await knex.schema.alterTable('histories', (table) => {
    table.specificType('predicted', 'float8[]').notNullable();
  });
};

exports.down = async function (knex) {
  // 🔄 元に戻す（float8[] → jsonb）
  await knex.schema.alterTable('histories', (table) => {
    table.dropColumn('predicted');
  });

  await knex.schema.alterTable('histories', (table) => {
    table.specificType('predicted', 'jsonb').notNullable();
  });
};
