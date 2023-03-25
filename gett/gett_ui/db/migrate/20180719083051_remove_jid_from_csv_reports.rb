Sequel.migration do
  up do
    drop_column :csv_reports, :jid
  end

  down do
    add_column :csv_reports, :jid, String
    add_index :csv_reports, :jid, unique: true
  end
end
