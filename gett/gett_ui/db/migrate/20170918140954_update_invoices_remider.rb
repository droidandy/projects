Sequel.migration do
  change do
    alter_table :invoices do
      add_column :reminder_sent, :boolean, default: false
    end
  end
end
