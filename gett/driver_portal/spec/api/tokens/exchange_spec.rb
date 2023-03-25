require 'rails_helper'
require 'swagger_helper'
require 'token_manager'

RSpec.describe 'User tokens API' do
  path '/tokens/{token}/exchange' do
    post 'Exchanges token for user JWT' do
      tags 'Tokens'

      consumes 'application/json'

      parameter name: :token,
        in: :path,
        type: :string

      let(:token) { 'token' }
      let(:user) { create :user }
      before(:each) { allow_any_instance_of(TokenManager).to receive(:driver_id).and_return(user.id) }

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

        run_test!
      end
    end
  end
end
