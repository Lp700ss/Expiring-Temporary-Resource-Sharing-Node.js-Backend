exports.up = async function(knex) {
    await knex.schema.table('resources', (table) => {
      table.index(['user_id'], 'idx_user_id');
      table.index(['status'], 'idx_status');
      table.index(['expiration_time'], 'idx_expiration_time');
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.table('resources', (table) => {
      table.dropIndex(['user_id'], 'idx_user_id');
      table.dropIndex(['status'], 'idx_status');
      table.dropIndex(['expiration_time'], 'idx_expiration_time');
    });
  };
  