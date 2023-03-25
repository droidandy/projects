require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'User sessions API' do
  path '/session' do
    post 'Creates new session' do
      tags 'Sessions'

      consumes 'application/json'

      parameter name: :session,
        in: :body,
        description: 'Session object that contains information about user',
        schema: {
          type: :object,
          properties: {
            email: {
              type: :string,
              example: 'test@example.com'
            },
            password: {
              type: :string,
              example: '123456789'
            }
          },
          required: [ :email, :password ]
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

        let(:user) { create(:user, :with_accepted_invitation, password: password, password_confirmation: password) }
        let(:password) { '123456789' }

        let(:session) do
          {
            email: user.email,
            password: password
          }
        end

        before { user }

        run_test!
      end

      response '422', 'session validation has been failed' do
        schema type: :object, properties: {
          errors: {
            type: :object,
            properties: {
              your_credentials: {
                type: :array,
                items: {
                  type: :string,
                  example: 'are invalid'
                }
              }
            }
          }
        }

        let(:user) { create(:user, password: password, password_confirmation: password) }
        let(:password) { '123456789' }

        let(:session) do
          {
            email: user.email,
            password: password.reverse
          }
        end

        before { user }

        run_test!
      end
    end
  end
end
