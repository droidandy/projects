Sequel.migration do
  up do
    alter_table :bookings do
      rename_column :ot_quote_id, :quote_id
    end
  end

  down do
    alter_table :bookings do
      rename_column :quote_id, :ot_quote_id
    end
  end
end
