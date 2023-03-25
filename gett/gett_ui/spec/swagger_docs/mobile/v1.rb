module SwaggerDocs
  MOBILE_V1_DOCS = {
    'mobile/v1/swagger.json' => {
      swagger: '2.0',
      info: {
        title: 'Mobile API',
        version: 'v1'
      },
      basePath: base_path('/mobile/v1'),
      securityDefinitions: {
        api_key: {
          type: :apiKey,
          description: 'JSON Web Token Authentication',
          name: 'Authorization',
          in: :header
        }
      },
      definitions: {
        error_object: {
          type: :object,
          properties: {
            error:  {type: :string, 'x-nullable': true},
            errors: {type: [:object, :array, :string, :null]}
          }
        },
        flight_schema: {
          type: :object,
          properties: {
            code:         {type: :string},
            name:         {type: :string},
            terminal:     {type: :string},
            time:         {type: :string},
            lat:          {type: :number},
            lng:          {type: :number},
            line:         {type: :string},
            postal_code:  {type: :string, 'x-nullable': true},
            country_code: {type: :string},
            timezone:     {type: :string},
            city:         {type: :string},
            airport:      {type: :string}
          }
        },
        flight_state_schema: {
          type: :object,
          properties: {
            code:           {type: :string},
            name:           {type: :string},
            scheduled_time: {type: :string, 'x-nullable': true},
            estimated_time: {type: :string, 'x-nullable': true},
            actual_time:    {type: :string, 'x-nullable': true},
            terminal:       {type: :string, 'x-nullable': true},
            gate:           {type: :string, 'x-nullable': true},
            baggage:        {type: :string, 'x-nullable': true},
            lat:            {type: :number},
            lng:            {type: :number},
            line:           {type: :string},
            postal_code:    {type: :string, 'x-nullable': true},
            country_code:   {type: :string},
            timezone:       {type: :string},
            city:           {type: :string},
            airport:        {type: :string}
          }
        },
        short_address_schema: {
          type: :object,
          properties: {
            line: {type: :string},
            lat:  {type: :number},
            lng:  {type: :number}
          },
          required: ['line', 'lat', 'lng']
        },
        address_schema: {
          type: :object,
          properties: {
            id:                {type: :integer},
            line:              {type: :string},
            lat:               {type: :number},
            lng:               {type: :number},
            postal_code:       {type: :string, 'x-nullable': true},
            country_code:      {type: :string, 'x-nullable': true},
            timezone:          {type: :string, 'x-nullable': true},
            city:              {type: :string, 'x-nullable': true},
            airport:           {type: :string, 'x-nullable': true},
            street_name:       {type: :string, 'x-nullable': true},
            street_number:     {type: :string, 'x-nullable': true},
            point_of_interest: {type: :string, 'x-nullable': true}
          },
          required: ['line', 'lat', 'lng'],
          'x-nullable': true
        },
        contact_schema: {
          type: :object,
          properties: {
            phone:      {type: :string},
            mobile:     {type: :string},
            fax:        {type: :string},
            email:      {type: :string},
            first_name: {type: :string},
            last_name:  {type: :string},
            address:    {'$ref' => '#/definitions/address_schema'}
          },
          'x-nullable': true
        },
        stop_point_schema: {
          type: :object,
          properties: {
            name:    {type: :string},
            phone:   {type: :string},
            address: {'$ref' => '#/definitions/address_schema'}
          }
        },
        booker_references_schema: {
          type: :array,
          items: {
            type: :object,
            properties: {
              value:                {type: :string},
              booking_reference_id: {type: :integer}
            }
          }
        },
        show_passenger_response_schema: {
          type: :object,
          properties: {
            passenger: {'$ref' => '#/definitions/passenger_schema'},
            can:       {'$ref' => '#/definitions/passenger_policies_schema'},
            last_logged_in: {type: :string},
            member_id:      {type: :integer},
            bookers: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:         {type: :integer},
                  first_name: {type: :string},
                  last_name:  {type: :string}
                }
              }
            },
            work_roles:     {type: :array, items: {type: :string}},
            departments:    {type: :array, items: {type: :string}},
            member_roles:   {type: :array, items: {type: :string}},
            company_type:   {type: :string},
            member_payment_types: {type: :array, items: {type: :string}},
            company_custom_attributes: {
              type: :object,
              properties: {
                travel_policy_mileage_limit: {type: :string, 'x-nullable': true},
                hw_deviation_distance:       {type: :string, 'x-nullable': true},
                excess_cost_per_mile:        {type: :string, 'x-nullable': true},
                p11d:                        {type: :string, 'x-nullable': true}
              },
              'x-nullable': true
            },
            payment_cards:         {type: :array, items: {type: :string}},
            favourite_addresses:   {type: :array, items: {type: :string}},
            payroll_required:      {type: :boolean},
            const_centre_required: {type: :boolean},
            locations:             {type: :array, items: {type: :string}}
          },
          required: ['passenger', 'can']
        },
        passenger_schema: {
          type: :object,
          properties: {
            id:                         {type: :integer},
            email:                      {type: :string},
            first_name:                 {type: :string},
            last_name:                  {type: :string},
            phone:                      {type: :string},
            mobile:                     {type: :string, 'x-nullable': true},
            work_role_id:               {type: :string, 'x-nullable': true},
            department_id:              {type: :string, 'x-nullable': true},
            role_type:                  {type: :string},
            onboarding:                 {type: :boolean, 'x-nullable': true},
            notify_with_sms:            {type: :boolean},
            notify_with_email:          {type: :boolean},
            notify_with_push:           {type: :boolean},
            notify_with_calendar_event: {type: :boolean},
            wheelchair_user:            {type: :boolean},
            vip:                        {type: :boolean},
            payroll:                    {type: :string, 'x-nullable': true},
            cost_centre:                {type: :string, 'x-nullable': true},
            division:                   {type: :string, 'x-nullable': true},
            default_vehicle:            {type: :string, 'x-nullable': true},
            home_address:               {'$ref' => '#/definitions/address_schema'},
            work_address:               {'$ref' => '#/definitions/address_schema'},
            active:                     {type: :boolean},
            avatar_url:                 {type: :string, 'x-nullable': true},
            avatar_versions:            {type: :object},
            self_assigned:              {type: :boolean, 'x-nullable': true},
            allow_personal_card_usage:  {type: :boolean},
            booker_pks: {
              type: :array,
              items: {type: :integer}
            },
            passenger_pks: {
              type: :array,
              items: {type: :integer}
            },
            custom_attributes: {
              type: :object,
              properties: {
                pd_type:                 {type: :string, 'x-nullable': true},
                wh_travel:               {type: :string, 'x-nullable': true},
                exemption_p11d:          {type: :string, 'x-nullable': true},
                exemption_ww_charges:    {type: :string, 'x-nullable': true},
                exemption_wh_hw_charges: {type: :string, 'x-nullable': true},
                hw_exemption_time_from:  {type: :string, 'x-nullable': true},
                hw_exemption_time_to:    {type: :string, 'x-nullable': true},
                wh_exemption_time_from:  {type: :string, 'x-nullable': true},
                wh_exemption_time_to:    {type: :string, 'x-nullable': true},
                excess_distance:         {type: :string, 'x-nullable': true},
                pd_accepted_at:          {type: :string, 'x-nullable': true}
              }
            }
          }
        },
        passenger_update_schema: {
          type: :object,
          properties: {
            first_name:                 {type: :string},
            last_name:                  {type: :string},
            email:                      {type: :string},
            phone:                      {type: :string},
            mobile:                     {type: :string, 'x-nullable': true},
            work:                       {type: :string, 'x-nullable': true},
            reference:                  {type: :string, 'x-nullable': true},
            department:                 {type: :string, 'x-nullable': true},
            active:                     {type: :boolean},
            avatar:                     {type: :string, 'x-nullable': true},
            onboarding:                 {type: :boolean, 'x-nullable': true},
            work_role_id:               {type: :integer},
            department_id:              {type: :integer, 'x-nullable': true},
            self_assigned:              {type: :boolean, 'x-nullable': true},
            role_type:                  {type: :string},
            notify_with_sms:            {type: :boolean},
            notify_with_email:          {type: :boolean},
            notify_with_push:           {type: :boolean},
            wheelchair_user:            {type: :boolean},
            payroll:                    {type: :string, 'x-nullable': true},
            cost_centre:                {type: :string, 'x-nullable': true},
            division:                   {type: :string, 'x-nullable': true},
            notify_with_calendar_event: {type: :boolean},
            vip:                        {type: :boolean},
            allow_personal_card_usage:  {type: :boolean},
            default_vehicle:            {type: :string, 'x-nullable': true},
            booker_pks: {
              type: :array,
              items: {type: :integer}
            },
            passenger_pks: {
              type: :array,
              items: {type: :integer}
            },
            work_address:     {'$ref' => '#/definitions/address_schema'},
            home_address:     {'$ref' => '#/definitions/address_schema'},
            custom_attribute: {'$ref' => '#/definitions/custom_attributes_schema'}
          }
        },
        custom_attributes_schema: {
          type: :object,
          properties: {
            pd_type:                 {type: :string, 'x-nullable': true},
            pd_accepted:             {type: :string, 'x-nullable': true},
            wh_travel:               {type: :string, 'x-nullable': true},
            exemption_p_11_d:        {type: :string, 'x-nullable': true},
            exemption_ww_charges:    {type: :string, 'x-nullable': true},
            exemption_wh_hw_charges: {type: :string, 'x-nullable': true},
            hw_exemption_time_from:  {type: :string, 'x-nullable': true},
            hw_exemption_time_to:    {type: :string, 'x-nullable': true},
            wh_exemption_time_from:  {type: :string, 'x-nullable': true},
            wh_exemption_time_t:     {type: :string, 'x-nullable': true}
          }
        },
        passenger_policies_schema: {
          type: :object,
          properties: {
            edit_all:                   {type: :boolean},
            change_active:              {type: :boolean},
            assign_bookers:             {type: :boolean},
            assign_self:                {type: :boolean},
            change_email:               {type: :boolean},
            change_department:          {type: :boolean},
            change_work_role:           {type: :boolean},
            change_role:                {type: :boolean},
            change_payroll:             {type: :boolean},
            change_cost_centre:         {type: :boolean},
            change_division:            {type: :boolean},
            add_payment_cards:          {type: :boolean},
            delete_payment_cards:       {type: :boolean},
            see_log:                    {type: :boolean},
            reinvite:                   {type: :boolean},
            change_personal_card_usage: {type: :boolean},
            see_payment_cards:          {type: :boolean},
            change_wheelchair:          {type: :boolean},
            edit_bbc_attrs:             {type: :boolean},
            accept_pd:                  {type: :boolean},
            change_pd:                  {type: :boolean}
          }
        },
        company_settings_schema: {
          type: :object,
          properties: {
            data: {
              type: :object,
              properties: {
                address:         {'$ref' => '#/definitions/address_schema'},
                primary_contact: {'$ref' => '#/definitions/contact_schema'},
                billing_contact: {'$ref' => '#/definitions/contact_schema'},
                sftp: {
                  type: :object,
                  'x-nullable': true,
                  properties: {
                    host:            {type: :string},
                    port:            {type: :string},
                    username:        {type: :string},
                    password:        {type: :string},
                    hr_feed_enabled: {type: :string},
                    references: {
                      type: :object,
                      properties: {
                        name:          {type: :string},
                        sftp_csv_path: {type: :string}
                      }
                    }
                  }
                },
                customer_service_phone: {type: :string}
              }
            },
            can: {
              type: :object,
              properties: {
                edit:             {type: [:boolean]},
                see_sftp_options: {type: [:boolean]}
              }
            }
          }
        },
        suggested_address_schema: {
          type: :object,
          properties: {
            id:    {type: :string},
            text:  {type: :string},
            types: {
              type: :array,
              items: {type: :string}
            },
            google: {type: :boolean}
          },
          required: ['id', 'text', 'types', 'google']
        },
        passenger_address_schema: {
          type: :object,
          properties: {
            id:                  {type: :integer},
            passenger_id:        {type: :integer},
            type:                {type: :string},
            name:                {type: :string, 'x-nullable': true},
            pickup_message:      {type: :string, 'x-nullable': true},
            destination_message: {type: :string, 'x-nullable': true},
            address:             {'$ref' => '#/definitions/address_schema'}
          }
        },
        booking_parameter_schema: {
          type: :object,
          properties: {
            vehicle_value:        {type: :string},
            vehicle_price:        {type: :number},
            vehicle_name:         {type: :string},
            vehicle_vendor_id:    {type: :integer},
            message:              {type: :string},
            quote_id:             {type: :integer},
            room:                 {type: :string},
            reason:               {type: :string},
            flight:               {type: :string},
            international_flag:   {type: :boolean},
            passenger_id:         {type: :integer},
            passenger_name:       {type: :string},
            passenger_phone:      {type: :string},
            travel_reason_id:     {type: :integer},
            scheduled_at:         {type: :string},
            scheduled_type:       {type: :string},
            payment_method:       {type: :string},
            payment_card_id:      {type: :integer},
            payment_type:         {type: :string},
            vehicle_count:        {type: :integer},
            as_directed:          {type: :boolean},
            journey_type:         {type: :string},
            special_requirements: {
              type: :array,
              items: {type: :string}
            },
            pickup_address:      {'$ref' => '#/definitions/address_schema'},
            destination_address: {'$ref' => '#/definitions/address_schema'},
            stops: {
              type: :array,
              items: {'$ref' => '#/definitions/stop_point_schema'}
            },
            booker_references: {'$ref' => '#/definitions/booker_references_schema'},
            schedule: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  custom:            {type: :boolean},
                  preset_type:       {type: :string},
                  starting_at:       {type: :string},
                  ending_at:         {type: :string},
                  workdays_only:     {type: :string},
                  recurrence_factor: {type: :string},
                  weekdays:      {type: :array, items: {type: :string}},
                  scheduled_ats: {type: :array, items: {type: :string}}
                }
              }
            }
          },
          required: [:vehicle_value, :passenger_phone, :payment_method, :pickup_address]
        },
        booking_event_schema: {
          type: :object,
          properties: {
            status:                {type: :string},
            is_first:              {type: :boolean},
            is_edge:               {type: :boolean},
            is_active:             {type: :boolean},
            is_previous_active:    {type: :boolean},
            is_animated:           {type: :boolean},
            is_interrupted:        {type: :boolean},
            interval_and_distance: {type: :string},
            time:                  {type: :string, 'x-nullable': true},
            cancelled_by:          {type: :string, 'x-nullable': true}
          },
          required: [
            'status', 'is_first', 'is_edge', 'is_active', 'is_previous_active',
            'is_animated', 'is_interrupted', 'interval_and_distance', 'time', 'cancelled_by'
          ]
        },
        booking_row_schema: {
          type: :object,
          properties: {
            id:                   {type: :integer},
            service_id:           {type: :string, 'x-nullable': true},
            status:               {type: :string},
            payment_method:       {type: :string},
            scheduled_at:         {type: :string},
            fare_quote:           {type: :number},
            recurring_next:       {type: :boolean},
            service_type:         {type: :string},
            indicated_status:     {type: :string},
            timezone:             {type: :string},
            journey_type:         {type: :string, 'x-nullable': true},
            passenger:            {type: :string},
            passenger_avatar_url: {type: :string, 'x-nullable': true},
            pickup_address:       {'$ref' => '#/definitions/address_schema'},
            destination_address:  {'$ref' => '#/definitions/address_schema'},
            vehicle_type:         {type: :string},
            payment_method_title: {type: :string},
            final:                {type: :boolean},
            alert_level:          {type: :string, 'x-nullable': true},
            eta:                  {type: :string, 'x-nullable': true},
            can: {
              type: :object,
              properties: {
                cancel: {type: [:boolean]}
              }
            },
            total_cost:           {type: :number},
            static_map:           {type: :string}
          },
          required: [
            'id', 'service_id', 'status', 'payment_method', 'scheduled_at',
            'fare_quote', 'recurring_next', 'service_type', 'indicated_status',
            'timezone', 'journey_type', 'passenger', 'passenger_avatar_url',
            'pickup_address', 'destination_address', 'vehicle_type',
            'payment_method_title', 'final', 'alert_level', 'eta', 'can'
          ]
        },
        booking_form_schema: {
          type: :object,
          properties: {
            journey_types: {type: :array, items: {type: :string}},
            payment_types: {type: :array, items: {type: :string}},
            default_pickup_address: {type: :string, 'x-nullable': true},
            default_driver_message: {type: :string, 'x-nullable': true},
            default_payment_type:   {type: :string},
            company_type:           {type: :string},
            service_suspended:      {type: :boolean},
            payment_type_options: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  default:        {type: :boolean},
                  label:          {type: :string},
                  payment_method: {type: :string},
                  value:          {type: :string}
                }
              }
            },
            travel_reasons: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:   {type: :integer},
                  name: {type: :string}
                }
              }
            },
            booking_references: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:          {type: :integer},
                  name:        {type: :string},
                  dropdown:    {type: :boolean},
                  cost_centre: {type: :string, 'x-nullable': true},
                  conditional: {type: :boolean},
                  mandatory:   {type: :boolean}
                }
              }
            },
            locations: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:                  {type: :integer},
                  name:                {type: :string},
                  pickup_message:      {type: :boolean},
                  destination_message: {type: :string, 'x-nullable': true},
                  default:             {type: :boolean},
                  created_at:          {type: :boolean},
                  address:             {type: :string}
                }
              }
            }
          }
        },
        booking_schema: {
          type: :object,
          properties: {
            id:                   {type: :integer},
            service_id:           {type: :string, 'x-nullable': true},
            booker_id:            {type: :integer},
            passenger_id:         {type: :integer},
            message:              {type: :string},
            flight:               {type: :string, 'x-nullable': true},
            room:                 {type: :string, 'x-nullable': true},
            asap:                 {type: :boolean},
            travel_distance:      {type: :number},
            message_to_driver:    {type: :string},
            ratable:              {type: :boolean},
            cancellation_reasons: {type: :array, items: {type: :string}},
            phone:                {type: :string},
            status:               {type: :string},
            payment_method:       {type: :string},
            scheduled_at:         {type: :string},
            fare_quote:           {type: :number},
            recurring_next:       {type: :boolean},
            service_type:         {type: :string},
            indicated_status:     {type: :string},
            timezone:             {type: :string},
            journey_type:         {type: :string, 'x-nullable': true},
            passenger:            {type: :string},
            passenger_avatar_url: {type: :string, 'x-nullable': true},
            booker:               {type: :string},
            booker_phone:         {type: :string},
            travel_reason:        {type: :string},
            vehicle_type:         {type: :string},
            payment_method_title: {type: :string},
            channel:              {type: :string},
            final:                {type: :boolean},
            alert_level:          {type: :string, 'x-nullable': true},
            alerts:               {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id:    {type: :integer},
                  level: {type: :string},
                  text:  {type: :string},
                  type:  {type: :string}
                }
              }
            },
            rating_reasons:       {type: :array, items: {type: :string}},
            cancelled_by_name:    {type: :string, 'x-nullable': true},
            company_type:         {type: :string},
            vendor_name:          {type: :string, 'x-nullable': true},
            vendor_phone:         {type: :string, 'x-nullable': true},
            driver_details: {
              type: :object,
              properties: {
                info: {
                  type: :object,
                  properties: {
                    name:         {type: :string},
                    rating:       {type: :number},
                    phv_license:  {type: :string},
                    vehicle: {
                      type: :object,
                      properties: {
                        color:         {type: :string},
                        model:         {type: :string},
                        licence_plate: {type: :string}
                      }
                    },
                    image_url:    {type: :string},
                    phone_number: {type: :string}
                  },
                  required: ['vehicle']
                },
                trip_rating:     {type: :number},
                location:        {type: :string},
                distance:        {type: :number},
                pickup_distance: {type: :number},
                eta:             {type: :number}
              },
              required: ['info']
            },
            path: {
              type: :array,
              items: {type: :array, items: {type: :number}}
            },
            references: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  value:                  {type: :string},
                  booking_reference_name: {type: :string}
                }
              },
              required: ['value', 'booking_reference_name']
            },
            events: {
              type: :array,
              items: {'$ref' => '#/definitions/booking_event_schema'}
            },
            pickup_address:      {'$ref' => '#/definitions/address_schema'},
            destination_address: {'$ref' => '#/definitions/address_schema'},
            stop_addresses: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  line:  {type: :string},
                  lat:   {type: :number},
                  lng:   {type: :number},
                  name:  {type: :string},
                  phone: {type: :string}
                },
                required: ['line', 'lat', 'lng', 'name', 'phone']
              }
            },
            can: {
              type: :object,
              properties: {
                cancel:   {type: [:boolean]},
                repeat:   {type: [:boolean]},
                edit:     {type: [:boolean]},
                see_logs: {type: [:boolean]}
              }
            },
            total_cost: {type: :number, 'x-nullable': true}
          },
          required: [
            'id', 'service_id', 'booker_id', 'passenger_id', 'message', 'flight',
            'room', 'asap', 'travel_distance', 'message_to_driver', 'rateable',
            'cancellation_reasons', 'phone', 'status', 'payment_method', 'scheduled_at',
            'fare_quote', 'recurring_next', 'service_type', 'indicated_status',
            'timezone', 'journey_type', 'passenger', 'passenger_avatar_url', 'booker',
            'booker_phone', 'travel_reason', 'vehicle_type', 'payment_method_title',
            'channel', 'final', 'alert_level', 'alerts', 'rating_reasons',
            'cancelled_by_name', 'company_type', 'vendor_name', 'vendor_phone',
            'driver_details', 'path', 'references', 'events', 'pickup_address',
            'destination_address', 'stop_addresses', 'can'
          ]
        }
      }
    }
  }.freeze
end
