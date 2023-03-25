require 'swagger_helper'

RSpec.describe 'Users API' do
  path '/users' do
    post 'Register a user' do
      tags 'Users'

      consumes 'application/json'

      parameter(
        name: :attributes,
        in: :body,
        description: 'User attributes',
        schema: {
          type: :object,
          required: [:attributes],
          properties: {
            attributes: {
              type: :object,
              properties: {
                email: {
                  type: :string,
                  example: 'm@il.com'
                },
                first_name: {
                  type: :string,
                  example: 'John'
                },
                last_name: {
                  type: :string,
                  example: 'Doe'
                },
                phone: {
                  type: :string,
                  example: '+41 123 456 789'
                },
                license_number: {
                  type: :string,
                  example: '112233'
                },
                how_did_you_hear_about: {
                  type: :string,
                  example: 'ads'
                }
              }
            }
          }
        }
      )

      let(:attributes) do
        {
          attributes: {
            email: 'm@il.com',
            first_name: 'John',
            last_name: 'Doe',
            phone: '+41 123 456 789',
            license_number: '112233',
            how_did_you_hear_about: 'ads'
          }
        }
      end
      before { create(:user, :system) }

      response '200', 'user registred successfully' do
        run_test!
      end
    end
  end
end
