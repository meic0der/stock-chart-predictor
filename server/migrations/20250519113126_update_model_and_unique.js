// migrations/202505xx_update_histories_add_range_model_and_unique.js
exports.up = async function (knex) {
 
  // 既存のユニーク制約を削除（もし存在する場合）
  await knex.schema.raw(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'histories_symbol_user_id_unique'
      ) THEN
        ALTER TABLE histories DROP CONSTRAINT histories_symbol_user_id_unique;
      END IF;
    END
    $$;
  `);

  // 複合ユニーク制約を追加
  await knex.schema.alterTable('histories', function (table) {
    table.unique(['symbol', 'user_id', 'range', 'model']);
  });
};

exports.down = async function (knex) {
  // ユニーク制約を元に戻す（必要に応じて）
  await knex.schema.alterTable('histories', function (table) {
    table.dropUnique(['symbol', 'user_id', 'range', 'model']);
  });



  // 元のユニーク制約を復元（必要なら）
  await knex.schema.alterTable('histories', function (table) {
    table.unique(['symbol', 'user_id']);
  });
};
