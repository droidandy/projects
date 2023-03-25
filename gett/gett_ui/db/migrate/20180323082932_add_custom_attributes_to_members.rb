Sequel.migration do
  change do
    alter_table :members do
      add_column :custom_attributes, :jsonb, null: false, default: '{}'
    end
  end
end
