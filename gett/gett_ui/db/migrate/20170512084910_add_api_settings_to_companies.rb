Sequel.migration do
  up do
    alter_table :companies do
      add_column :gett_business_id, String
      add_column :ot_username, String
      add_column :ot_client_number, String
    end

    from(:companies).update(
      gett_business_id: 'UK-3836',
      ot_username:      'Demo_admin',
      ot_client_number: 'D25'
    )

    alter_table :companies do
      set_column_not_null :gett_business_id
      set_column_not_null :ot_username
      set_column_not_null :ot_client_number
    end
  end

  down do
    alter_table :companies do
      drop_column :gett_business_id
      drop_column :ot_username
      drop_column :ot_client_number
    end
  end
end
