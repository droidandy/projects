Sequel.migration do
  change do
    alter_table :members do
      add_column :added_through_hr_feed, 'Boolean', null: false, default: false
    end

    alter_table :companies do
      add_column :hr_feed_enabled, 'Boolean', null: false, default: false
      add_column :hr_feed_username, String
      add_column :hr_feed_password, String
    end
  end
end
