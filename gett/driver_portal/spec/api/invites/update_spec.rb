require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Invitation API' do
  path '/invites/{token}' do
    post 'Accept invite' do
      tags 'Users'

      consumes 'application/json'

      parameter name: :token,
        in: :path,
        type: :string

      parameter name: :body,
        in: :body,
        description: 'Request body',
        schema: {
          type: :object,
          properties: {
            password: {
              type: :string,
              example: '123456789'
            },
            password_confirmation: {
              type: :string,
              example: 'test@example.com'
            },
          }
        }

      let(:user) { create(:user, :with_driver_role) }
      let(:admin) { create(:user, :with_site_admin_role) }

      let(:service) do
        service = Invites::Create.new(admin, user_id: user.id)
        service.execute!

        raise 'Something went wrong with token creation' unless service.success?

        service
      end

      let(:invite) { service.invite }
      let(:token) { service.token }
      let(:password) { '123456789' }
      let(:password_confirmation) { password }

      let(:body) do
        {
          password: password,
          password_confirmation: password_confirmation
        }
      end

      response '200', 'successfully updated invite on intermediate step' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/invite'
        }

        run_test!
      end

      response '200', 'successfully accepted invite on final step' do
        schema type: :object, properties: {
          access_token: {
            type: :string,
            example: JWT_TOKEN_EXAMPLE,
            description: 'Created JWT token for the session'
          },
          user: {
            '$ref' => '#/definitions/user'
          }
        }

        before do
          invite.brief_step!
        end

        run_test!
      end

      response '422', 'validation has been failed' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/errors'
        }

        let(:password_confirmation) { 'foobar' }

        before do
          invite.password_step!
        end

        run_test!
      end
    end
  end
end
