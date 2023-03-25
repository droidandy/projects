Sequel.migration do
  up do
    alter_table :user_devices do
      drop_constraint :user_devices_token_key
    end
  end

  down do
    DB[:user_devices].delete # drop tokens to get rid of duplication
    alter_table :user_devices do
      add_unique_constraint :token
    end
  end
end
