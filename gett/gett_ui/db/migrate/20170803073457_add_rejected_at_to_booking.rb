Sequel.migration do
  up do
    alter_table :bookings do
      add_column :rejected_at, DateTime
    end

    from(:bookings).where(status: 'rejected').update(rejected_at: :updated_at)
  end

  down do
    alter_table :bookings do
      remove_column :rejected_at
    end
  end
end
