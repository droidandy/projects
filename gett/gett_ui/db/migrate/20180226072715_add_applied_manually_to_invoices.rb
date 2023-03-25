Sequel.migration do
  change do
    alter_table :invoices do
      add_column :applied_manually, :boolean, null: false, default: false
    end
  end
end
