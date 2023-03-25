module SwaggerDocs
  EXTERNAL_DOCS = {
    'external/swagger.json' => {
      swagger: '2.0',
      info: {
        title: 'External API',
        version: 'v1'
      },
      # requests on this external API are made without '/api' prefix and
      # are handled by dedicated nginx's `location` block
      basePath: '/external',
      securityDefinitions: {
        api_key: {
          type: :apiKey,
          name: 'X-Api-Key',
          in: :header
        }
      },
      definitions: {
        errors_object: {
          type: :object,
          properties: {
            errors: {type: :string, 'x-nullable': true}
          },
          required: ['errors']
        },
        address_schema: {
          type: :object,
          properties: {
            postal_code:  {type: :string, 'x-nullable': true},
            lat:          {type: :number},
            lng:          {type: :number},
            line:         {type: :string},
            airport:      {type: :string, 'x-nullable': true},
            country_code: {type: :string},
            city:         {type: :string},
            timezone:     {type: :string}
          },
          required: [:lat, :lng, :line]
        },
        booking_params_schema: {
          type: :object,
          properties: {
            vehicle_value:       {type: :string},
            message:             {type: :string},
            passenger_id:        {type: :number, 'x-nullable': true},
            passenger_name:      {type: :string},
            passenger_phone:     {type: :string},
            travel_reason_id:    {type: :string},
            scheduled_at:        {type: :datetime},
            scheduled_type:      {type: :string},
            vehicle_count:       {type: :number},
            payment_method:      {type: :string},
            pickup_address:      {'$ref' => '#/definitions/address_schema'},
            destination_address: {'$ref' => '#/definitions/address_schema'},
            stops: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  name:    {type: :string},
                  phone:   {type: :string},
                  address: {'$ref' => '#/definitions/address_schema'}
                }
              }
            }
          },
          required: ['vehicle_value', 'pickup_address', 'payment_method']
        },
        booking_data_schema: {
          type: :object,
          properties: {
            id:                   {type: :number},
            service_id:           {type: :string, 'x-nullable': true},
            message:              {type: :string, 'x-nullable': true},
            flight:               {type: :string, 'x-nullable': true},
            status:               {type: :string},
            payment_method:       {type: :string},
            scheduled_at:         {type: :datetime},
            asap:                 {type: :boolean},
            travel_distance:      {type: :number},
            service_type:         {type: :string},
            message_to_driver:    {type: :string},
            indicated_status:     {type: :string},
            passenger:            {type: :string},
            passenger_avatar_url: {type: :string, 'x-nullable': true},
            phone:                {type: :string},
            pickup_address:       {'$ref' => '#/definitions/address_schema'},
            destination_address:  {'$ref' => '#/definitions/address_schema'},
            stop_addresses: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  line:  {type: :string},
                  name:  {type: :string},
                  phone: {type: :string}
                }
              }
            },
            vehicle_type:         {type: :string},
            booker:               {type: :string},
            booker_phone:         {type: :string},
            travel_reason:        {type: :string},
            references: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  value:                  {type: :string},
                  booking_reference_name: {type: :string}
                },
                required: ['value', 'booking_reference_name']
              }
            },
            payment_method_title: {type: :string},
            channel:              {type: :string},
            final:                {type: :boolean},
            driver_details:       {type: :object},
            path:                 {type: :array, items: {type: :array, items: {type: :number}}},
            ot_created_ago:       {type: :string, 'x-nullable': true},
            cancelled_by_name:    {type: :string, 'x-nullable': true},
            events:               {type: :array, items: {type: :object}},
            can: {
              type: :object,
              properties: {
                cancel: {type: :boolean},
                repeat: {type: :boolean}
              }
            },
            alert_level: {type: :string, 'x-nullable': true},
            alerts: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:    {type: :number},
                  level: {type: :string},
                  type:  {type: :string},
                  text:  {type: :string}
                },
                required: ['id', 'level', 'type', 'text']
              }
            },
            rateable: {type: :boolean}
          },
          required: [
            'id', 'service_id', 'message', 'flight', 'status', 'payment_method', 'scheduled_at', 'asap',
            'travel_distance', 'service_type', 'message_to_driver', 'indicated_status', 'passenger',
            'passenger_avatar_url', 'phone', 'pickup_address', 'destination_address', 'stop_addresses',
            'vehicle_type', 'booker', 'booker_phone', 'travel_reason', 'references',
            'payment_method_title', 'channel', 'final', 'driver_details', 'path',
            'cancelled_by_name', 'events', 'can', 'alert_level', 'alerts'
          ]
        }
      }
    }
  }.freeze
end
