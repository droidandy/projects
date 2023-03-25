using Sequel::CoreRefinements

Sequel.migration do
  up do
    alter_table :bookings do
      add_column :ot_quote_id, String
      add_column :ot_confirmation_number, String
      add_column :ot_job_status, String
      add_column :ot_vehicle_state, String
    end

    create_table :booking_drivers do
      primary_key :id
      foreign_key :booking_id, :bookings, null: false
      String :name
      Float :rating
      String :image_url
      String :phone_number
      Float :lat
      Float :lng
      Integer :eta
      Float :distance
      DateTime :will_arrive_at
      Float :pickup_lat
      Float :pickup_lng
      hstore :vehicle
      jsonb :path_points

      timestamps

      index :booking_id, unique: true
    end

    booking_info = Sequel.pg_json_op(:bookings[:booking_info])
    from(:bookings).update(
      ot_quote_id:            booking_info.get_text('quote_id'),
      ot_confirmation_number: booking_info.get_text('confirmation_number'),
      ot_job_status:          booking_info.get_text(%w'ride job_status'),
      ot_vehicle_state:       booking_info.get_text(%w'ride vehicle_state')
    )

    from(:booking_drivers).insert(
      [ :booking_id, :name, :rating, :image_url, :phone_number, :lat, :lng, :eta, :distance,
        :will_arrive_at, :pickup_lat, :pickup_lng, :vehicle, :path_points, :created_at, :updated_at ],
      from(:bookings).select do
        [
          id.as(:booking_id),
          booking_info.get_text(%w'ride driver name').as(:name),
          booking_info.get_text(%w'ride driver rating').cast(:float).as(:rating),
          booking_info.get_text(%w'ride driver image_url').as(:image_url),
          booking_info.get_text(%w'ride driver phone_number').as(:phone_number),
          booking_info.get_text(%w'ride driver_location lat').cast('float').as(:lat),
          booking_info.get_text(%w'ride driver_location lng').cast('float').as(:lng),
          booking_info.get_text(%w'ride eta').cast('integer').as(:eta),
          booking_info.get_text(%w'ride distance').cast('float').as(:distance),
          booking_info.get_text(%w'ride will_arrive_at').cast('timestamp with time zone').as(:will_arrive_at),
          booking_info.get_text(%w'ride pickup_location lat').cast(:float).as(:pickup_lat),
          booking_info.get_text(%w'ride pickup_location lng').cast(:float).as(:pickup_lng),
          hstore(
            ['model', 'color', 'license_plate'].pg_array,
            [
              booking_info.get_text(%w'ride driver vehicle model'),
              booking_info.get_text(%w'ride driver vehicle color'),
              booking_info.get_text(%w'ride driver vehicle license_plate')
            ].pg_array
          ).as(:vehicle),
          path_points,
          created_at,
          updated_at
        ]
      end
    )

    alter_table :bookings do
      drop_column :booking_info
      drop_column :path_points
    end
  end

  down do
    alter_table :bookings do
      add_column :booking_info, :jsonb
      add_column :path_points, :jsonb
    end

    driver_vehicle = Sequel.hstore_op(:booking_drivers[:vehicle])
    from(:bookings, :booking_drivers)
      .where(:booking_drivers[:booking_id] => :bookings[:id])
      .update(
        path_points: :booking_drivers[:path_points],
        booking_info: :json_build_object.sql_function(
          'ride_id',             :bookings[:service_id],
          'quote_id',            :bookings[:ot_quote_id],
          'confirmation_number', :bookings[:ot_confirmation_number],
          'external_reference',  :bookings[:service_id],
          'ride',                :json_build_object.sql_function(
            'job_status',      :bookings[:ot_job_status],
            'vehicle_state',   :bookings[:ot_vehicle_state],
            'eta',             :booking_drivers[:eta],
            'distance',        :booking_drivers[:distance],
            'will_arrive_at',  :booking_drivers[:will_arrive_at],
            'driver_location', :json_build_object.sql_function(
              'lat', :booking_drivers[:lat],
              'lng', :booking_drivers[:lng]
            ),
            'pickup_location', :json_build_object.sql_function(
              'lat', :booking_drivers[:pickup_lng],
              'lng', :booking_drivers[:pickup_lng]
            ),
            'driver', :json_build_object.sql_function(
              'name',         :booking_drivers[:name],
              'image_url',    :booking_drivers[:image_url],
              'phone_number', :booking_drivers[:phone_number],
              'rating',       :booking_drivers[:rating],
              'vehicle',      :json_build_object.sql_function(
                'model',         driver_vehicle['model'],
                'color',         driver_vehicle['color'],
                'license_plate', driver_vehicle['license_plate']
              )
            )
          )
        ).cast(:jsonb)
      )

    drop_table :booking_drivers

    alter_table :bookings do
      drop_column :ot_quote_id
      drop_column :ot_confirmation_number
      drop_column :ot_job_status
      drop_column :ot_vehicle_state
    end
  end
end
