Sequel.migration do
  up do
    create_table :deployment_notifications do
      primary_key :id
      String :text
      timestamps
    end

    DB[:deployment_notifications].insert(created_at: Time.current, updated_at: Time.current, text: <<-BODY.squish)
      New platform version has been deployed on
      {deployment_time},
      please refresh your browsers to benefit from latest functionality
    BODY
  end

  down do
    drop_table :deployment_notifications
  end
end
