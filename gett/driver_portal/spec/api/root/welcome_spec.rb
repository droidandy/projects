require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Root API' do
  path '/' do
    get 'Responds with simple hello message' do
      tags 'Root'

      consumes 'application/json'

      response '200', 'successful check' do
        schema type: :object, properties: {
          message: {
            type: :string,
            example: 'It works!'
          }
        }

        run_test!
      end
    end
  end
end
