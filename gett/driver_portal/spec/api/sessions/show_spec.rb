require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'User sessions API' do
  path '/session' do
    get 'Provides access to current session' do
      tags 'Sessions'

      consumes 'application/json'

      user_authentication_required!

      response '200', 'successful access to current session object' do
        schema '$ref' => '#/definitions/user'

        run_test!
      end
    end
  end
end
