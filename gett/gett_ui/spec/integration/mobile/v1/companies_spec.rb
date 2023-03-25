require 'swagger_helper'

describe 'Company API', swagger_doc: 'mobile/v1/swagger.json' do
  path '/company/create_signup_request' do
    post 'Create company Signup Request' do
      tags 'Company'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :params, in: :body, schema: {
        type: :object,
        properties: {
          company: {
            type: :object,
            properties: {
              email:        {type: :string},
              name:         {type: :string},
              user_name:    {type: :string},
              phone_number: {type: :string},
              country:      {type: :string},
              comment:      {type: :string},
              accept_tac:   {type: :boolean},
              accept_pp:    {type: :boolean}
            },
            required: [:email, :name, :user_name]
          }
        },
        required: [:company]
      }

      response '200', 'creates a company Signup Request' do
        let(:params) do
          {
            company: {
              email:        'swagger@fakemail.com',
              name:         'Swagger Company',
              user_name:    'Swagger Admin',
              phone_number: '+100123123123',
              country:      'SE',
              comment:      'A comment',
              accept_tac:   true,
              accept_pp:    true
            }
          }
        end

        run_test!
      end
    end
  end
end
