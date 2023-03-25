require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Statements API' do
  path '/statements/generate_pdf' do
    post 'Generate ZIP with statements PDFs' do
      tags 'Statements'

      consumes 'application/json'

      parameter name: :body,
        in: :body,
        description: 'Session object that contains information about user',
        schema: {
          type: :object,
          properties: {
            from: {
              type: :array,
              items: {
                type: :integer
              },
              description: 'List of statements IDs',
              example: '[3016373, 2908601]'
            }
          },
          required: [ :ids ]
        }

      let(:statements) { create_list(:statement, 2) }
      let(:body) do
        {
          ids: statements.map(&:external_id)
        }
      end

      user_authentication_required!

      response '200', 'PDFs sent successfully' do
        schema type: :object, properties: {
          url: {
            type: :string,
            example: '/system/uploads/downloads/filename.csv',
            description: 'URL of generated file'
          }
        }

        run_test!
      end
    end
  end
end
