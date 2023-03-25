require 'rails_helper'
require 'swagger_helper'
require 'session'

RSpec.describe 'User reset password API' do
  path '/reset_password/{token}' do
    post 'Resets password for the user by token' do
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
          },
          required: [ :password, :password_confirmation ]
        }

      response '200', 'new session has been created' do
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

        let!(:user) do
          allow(Session).to receive(:last_activity).and_return(Time.current)
          create(:user, password: password, password_confirmation: password)
        end

        let(:password) { '123456789' }

        let(:token) do
          service = Passwords::Reset.new(email: user.email)
          service.execute!

          raise 'Something went wrong with password reset' if service.fail?

          service.token
        end

        let(:body) do
          {
            password: password,
            password_confirmation: password
          }
        end

        run_test!
      end
    end
  end
end
