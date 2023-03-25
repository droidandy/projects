Sequel.migration do
  change do
    create_enum :csv_report_recurrence, %w(monthly weekly daily)

    create_table :csv_reports do
      primary_key :id
      foreign_key :company_id, :companies, null: false

      csv_report_recurrence :recurrence, null: false, default: 'monthly'

      DateTime :recurrence_starts_at, null: false
      String :name, null: false
      String :delimiter, default: ','
      String :recipients, text: true, null: false

      hstore :headers
      String :jid

      index [:company_id, :name], unique: true
      index :jid, unique: true

      timestamps
    end
  end
end
