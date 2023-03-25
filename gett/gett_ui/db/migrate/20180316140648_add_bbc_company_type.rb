Sequel.migration do
  no_transaction

  up do
    add_enum_value :company_type, 'bbc', if_not_exists: true

    alter_table :companies do
      add_column :custom_attributes, :hstore
    end
  end

  down do
    alter_table :companies do
      drop_column :custom_attributes
    end
  end
end
