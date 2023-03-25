require 'swagger_helper'

describe 'Sessions API', swagger_doc: 'mobile/v1/swagger.json' do
  path '/session' do
    get 'Shows a session' do
      tags 'Session'
      produces 'application/json'
      security [ api_key: [] ]

      response '200', 'returns session data' do
        schema(
          type: :object,
          properties: {
            email:             {type: :string},
            name:              {type: :string},
            member_id:         {type: :integer},
            reincarnated:      {type: :boolean},
            guide_passed:      {type: :boolean},
            import_channel:    {type: :string},
            is_affiliate:      {type: :boolean},
            onboarding:        {type: :boolean, 'x-nullable': true},
            warning:           {type: :boolean, 'x-nullable': true},
            active_booking_id: {type: :integer, 'x-nullable': true},
            internal_messages_channel:   {type: :string},
            external_messages_channel:   {type: :string},
            bookings_validation_enabled: {type: :boolean},
            future_bookings_count:       {type: :integer},
            closest_future_booking_id:   {type: :integer, 'x-nullable': true},
            layout: {
              type: :object,
              properties: {
                company_name:  {type: :string},
                company_phone: {type: :string, 'x-nullable': true},
                logo_url:      {type: :string, 'x-nullable': true}
              }
            },
            can: {
              type: :object,
              properties: {
                see_bookers:                {type: :boolean},
                administrate_company:       {type: :boolean},
                manage_travel_policies:     {type: :boolean},
                manage_travel_reasons:      {type: :boolean},
                manage_finance:             {type: :boolean},
                manage_report_settings:     {type: :boolean},
                see_statistics:             {type: :boolean},
                see_procurement_statistics: {type: :boolean},
                create_passengers:          {type: :boolean}
              }
            }
          }
        )

        run_test!
      end
    end

    post 'Creates a session' do
      tags 'Session'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email:            {type: :string},
              password:         {type: :string},
              captcha_response: {type: :string},
              app_type:         {type: :string}
            },
            required: [:email, :password]
          }
        },
        required: ['user']
      }

      response '200', 'creates a new session and returns token and realms information' do
        let!(:user) { create(:member) }
        let(:params) { { user: { email: user.email, password: user.password} } }

        schema(
          type: :object,
          properties: {
            token:  {type: :string},
            realms: {
              type: :array,
              items: {type: :string}
            }
          },
          required: ['token']
        )

        run_test!
      end

      response '401', 'unauthorized' do
        let(:params) { { user: { email: 'email@mail.com', password: '' } } }

        schema('$ref' => '#/definitions/error_object')

        run_test!
      end
    end
  end
end
