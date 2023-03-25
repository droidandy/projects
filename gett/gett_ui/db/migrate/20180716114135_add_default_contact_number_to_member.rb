Sequel.migration do
  change do
    alter_table :members do
      add_column :default_phone_type, String, null: false, default: 'phone'
    end
  end
end
