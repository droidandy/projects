Sequel.migration do
  change do
    alter_table :companies do
      rename_column :hr_feed_username, :sftp_username
      rename_column :hr_feed_password, :sftp_password
    end
  end
end
