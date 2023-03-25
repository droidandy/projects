Sequel.migration do
  up do
    create_table :salesmen do
      primary_key :id
      String :first_name
      String :last_name

      timestamps
    end

    alter_table :companies do
      drop_column :sales_person
      add_foreign_key :salesman_id, :salesmen
    end
  end

  down do
    alter_table :companies do
      add_column :sales_person, String
      drop_column :salesman_id
    end

    drop_table :salesmen
  end
end
