Sequel.migration do
  change do
    add_column :booking_references, :sftp_server, :boolean, null: false, default: false
  end
end
