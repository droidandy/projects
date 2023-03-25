# rubocop:disable Style/RescueModifier
Sequel.extension :core_refinements
Sequel.extension :named_timezones
Sequel.extension :thread_local_timezones
Sequel.default_timezone = :utc
Sequel.extension :pg_json_ops
Sequel.extension :pg_array_ops
Sequel.extension :pg_hstore_ops

DB = Sequel::Model.db

if (DB.test_connection rescue false)
  DB.extension(:pagination)
  DB.extension(:pg_json)
  DB.extension(:pg_enum)
  DB.extension(:pg_array)
  DB.extension(:pg_hstore) rescue nil # necessary to run `db:prepare` task for existing DB without extension
  DB.register_array_type('payment_type')
  DB.extension(:null_dataset)
  DB.extension(:dataset_helper_methods)
  DB.extension(:server_block)
end
# rubocop:enable Style/RescueModifier
