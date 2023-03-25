require 'swagger_helper'

describe 'Company Settings API', swagger_doc: 'mobile/v1/swagger.json' do
  path '/company/settings' do
    get 'List of company settings' do
      tags 'Company Settings'
      produces 'application/json'
      security [ api_key: [] ]

      response '200', 'returns company settings data' do
        schema('$ref' => '#/definitions/company_settings_schema')

        run_test!
      end
    end
  end
end
