Sequel.migration do
  up do
    run 'CREATE EXTENSION IF NOT EXISTS hstore'

    # content of this migration is dropped in favor of `db:create_orders` rake task
  end
end
