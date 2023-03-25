Sequel.migration do
  change do
    create_enum :booking_source_type, %w(api web web_mobile mobile_app)

    alter_table :bookings do
      add_column :source_type, 'booking_source_type'
    end
  end
end
