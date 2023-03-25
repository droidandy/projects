require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Statements API' do
  path '/statements/email_me' do
    post 'Sends PDFs with statements data to driver' do
      tags 'Statements'

      consumes 'application/json'

      parameter name: :body,
                in: :body,
                description: 'Body',
                schema: {
                  type: :object,
                  properties: {
                    ids: {
                      type: :array,
                      items: {
                        type: :string
                      },
                      description: 'List of statements IDs to filter by',
                      example: ['3016373', '2908601']
                    }
                 }
              }

      let(:statements) { create_list(:statement, 2) }

      let(:body) do
        {
          ids: statements.map(&:external_id)
        }
      end

      user_authentication_required!

      response '200', 'PDFs sent successfully' do
        run_test!
      end
    end
  end
end
