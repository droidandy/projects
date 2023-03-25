Sequel.migration do
  up do
    alter_table :bookings do
      add_column :asap, 'Boolean', default: true, null: false
    end

    from(:bookings).exclude(scheduled_at: nil).update(asap: false)
    from(:bookings).where(asap: true).update(scheduled_at: :created_at)

    alter_table :bookings do
      set_column_not_null :scheduled_at
    end
  end

  down do
    alter_table :bookings do
      set_column_allow_null :scheduled_at
    end

    from(:bookings).where(asap: true).update(scheduled_at: nil)

    alter_table :bookings do
      drop_column :asap
    end
  end
end
