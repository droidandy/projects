Sequel.migration do
  up do
    alter_table :invoices do
      add_column :under_review, :boolean, default: false, null: false
      drop_column :reminder_sent
    end
  end

  down do
    alter_table :invoices do
      drop_column :under_review
      add_column :reminder_sent, :boolean, default: false
    end
  end
end
