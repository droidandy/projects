require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Support requests API' do
  path '/support_requests' do
    post 'Sends email to support team' do
      tags 'Support requests'

      consumes 'application/json'

      parameter name: :body,
                in: :body,
                description: 'Body',
                schema: {
                  type: :object,
                  properties: {
                    message: {
                      type: :string
                    }
                 }
              }

      let(:body) do
        {
          message: 'Lorem ipsum'
        }
      end

      user_authentication_required! current_user_traits: [:with_avatar]

      response '200', 'successfully sent invites to the users' do
        run_test!
      end
    end
  end
end
