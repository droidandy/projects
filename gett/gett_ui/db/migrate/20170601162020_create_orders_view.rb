using Sequel::CoreRefinements

Sequel.migration do
  up do
    alter_table :bookings do
      add_column :arrived_at, DateTime
      add_column :started_at, DateTime
      add_column :ended_at, DateTime
      add_column :cancelled_at, DateTime
    end

    # content of this migration is dropped in favor of `db:create_orders` rake task
  end

  down do
    alter_table :bookings do
      drop_column :arrived_at
      drop_column :started_at
      drop_column :ended_at
      drop_column :cancelled_at
    end
  end
end
