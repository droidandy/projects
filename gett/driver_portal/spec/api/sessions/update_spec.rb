require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'User sessions API' do
  path '/session' do
    put 'Update user profile' do
      tags 'Sessions'

      consumes 'application/json'

      parameter name: :attributes,
        in: :body,
        description: 'User attributes to be updated',
        schema: {
          type: :object,
          properties: {
            attributes: {
              type: :object,
              properties: {
                email: {
                  type: :string,
                  example: 'anton.macius@gettaxi.com'
                },
                first_name: {
                  type: :string,
                  example: 'John1'
                },
                last_name: {
                  type: :string,
                  example: 'Doe'
                },
                phone: {
                  type: :string,
                  example: '+7987654321'
                },
                address: {
                  type: :string
                },
                postcode: {
                  type: :string
                },
                hobbies: {
                  type: :string
                },
                talking_topics: {
                  type: :string
                },
                driving_cab_since: {
                  type: :string,
                  format: :date
                },
                disability_type: {
                  type: :string
                },
                disability_description: {
                  type: :string
                },
                account_number: {
                  type: :string
                },
                sort_code: {
                  type: :string
                },
                vehicle_colour: {
                  type: :string
                },
                birth_date: {
                  type: :string,
                  format: :date
                },
                city: {
                  type: :string,
                  example: 'Pochinki'
                }
              },
              required: []
            }
          },
          required: [:attributes]
        }

      let(:attributes) do
        {
          attributes: {
            email: 'anton.macius@gettaxi.com',
            first_name: 'John1',
            last_name: 'Doe',
            phone: '+7987654321',
            city: 'Pochinki'
          }
        }
      end

      user_authentication_required!(current_user_traits: [:with_driver_role])
      let(:body) { json_body('gett/fleet_api/update_driver') }
      before(:each) { stub_client(GettFleetApi::Client, :update_driver, body, response_class: GettFleetApi::Response) }

      response '200', 'user updated successfully' do
        schema '$ref' => '#/definitions/user'

        run_test!
      end
    end
  end
end
