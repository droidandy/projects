Sequel.migration do
  up do
    from(:company_infos).update(salesman_id: nil)

    alter_table :company_infos do
      drop_foreign_key [:salesman_id]
      add_foreign_key [:salesman_id], :users
    end

    drop_view :orders, if_exists: true
    drop_table :salesmen
  end

  down do
    create_table :salesmen do
      primary_key :id
      String :first_name
      String :last_name

      timestamps
    end

    from(:company_infos).update(salesman_id: nil)

    alter_table :company_infos do
      drop_foreign_key [:salesman_id]
      add_foreign_key [:salesman_id], :salesmen
    end
  end
end
