Sequel.migration do
  up do
    create_enum :ddi_type, %w(small standard mega custom)

    create_table :ddis do
      primary_key :id
      ddi_type :type, null: false
      String :phone, null: false

      index :type
    end
    alter_table :companies do
      add_foreign_key :ddi_id, :ddis
    end

    predefined_phone = '+442036089312'

    DB[:ddis].insert(type: 'small', phone: predefined_phone)
    DB[:ddis].insert(type: 'mega', phone: predefined_phone)
    standard_id = DB[:ddis].insert(type: 'standard', phone: predefined_phone)

    from(:companies).update(ddi_id: standard_id)

    alter_table :companies do
      set_column_not_null :ddi_id
    end
  end

  down do
    alter_table :companies do
      drop_foreign_key :ddi_id
    end

    drop_table :ddis
    drop_enum :ddi_type
  end
end
