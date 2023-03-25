Sequel.migration do
  change do
    alter_table :addresses do
      add_foreign_key :airport_id, :airports
    end

    alter_table :predefined_addresses do
      add_foreign_key :airport_id, :airports
    end
  end
end
