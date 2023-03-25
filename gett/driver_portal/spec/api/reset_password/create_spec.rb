require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'User reset password API' do
  path '/reset_password' do
    post 'Creates new reset password token for user' do
      tags 'Users'

      consumes 'application/json'


      parameter name: :body,
        in: :body,
        description: 'Request body',
        schema: {
          type: :object,
          properties: {
            email: {
              type: :string,
              example: 'test@example.com'
            },
          },
          required: [ :email ]
        }

      response '200', 'new session has been created' do
        let!(:user) do
          create(:user, password: password, password_confirmation: password)
        end

        let(:password) { '123456789' }

        let(:body) do
          {
            email: user.email
          }
        end

        run_test!
      end
    end
  end
end
