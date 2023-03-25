Sequel.migration do
  up do
    alter_table :companies do
      set_column_allow_null :ot_username
      set_column_allow_null :ot_client_number
    end
  end

  down do
    alter_table :companies do
      set_column_not_null :ot_username
      set_column_not_null :ot_client_number
    end
  end
end
