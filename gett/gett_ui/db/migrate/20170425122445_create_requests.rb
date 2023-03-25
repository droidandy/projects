Sequel.migration do
  up do
    create_enum :request_status, %w(created sent received processed error)

    create_table :requests do
      primary_key :id
      service_provider :service_provider
      request_status :status, null: false, default: 'created'
      String :url, null: false
      String :subject_gid

      jsonb :request_payload
      jsonb :response_payload

      timestamps
    end
  end

  down do
    drop_table :requests
    drop_enum :request_status
  end
end
