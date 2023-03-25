require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Admins API' do
  path '/admins/{id}' do
    put 'Update admin user' do
      tags 'Admins'

      consumes 'application/json'

      parameter name: :id, in: :path
      parameter name: :attributes,
        in: :body,
        description: 'User attributes',
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
                active: {
                  type: :boolean,
                  example: '+7987654321'
                },
                role: {
                  type: :string,
                  enum: %w[
                    community_manager
                    compliance_agent
                    driver_support
                    site_admin
                    onboarding_agent
                  ]
                }
              }
            }
          },
          required: [:attributes]
        }

      let(:user) { create :user, :with_site_admin_role }
      let(:id) { user.id }
      let(:attributes) do
        {
          attributes: {
            email: 'anton.macius@gettaxi.com',
            first_name: 'John1',
            last_name: 'Doe',
            active: true,
            role: 'site_admin'
          }
        }
      end

      user_authentication_required!(current_user_traits: [:with_site_admin_role])

      response '200', 'user updated successfully' do
        schema '$ref' => '#/definitions/user'

        run_test!
      end
    end
  end
end
