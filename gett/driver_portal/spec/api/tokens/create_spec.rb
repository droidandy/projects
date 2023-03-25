require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'User tokens API' do
  path '/tokens' do
    post 'Creates new token' do
      tags 'Tokens'

      consumes 'application/json'

      parameter name: :body,
        in: :body,
        schema: {
          type: :object,
          properties: {
            driver_id: {
              type: :integer
            }
          }
        }

      let(:body) do
        { driver_id: create(:user).id }
      end

      response '200', 'new session has been created' do
        schema type: :object, properties: {
          token: {
            type: :string,
          }
        }

        run_test!
      end
    end
  end
end
