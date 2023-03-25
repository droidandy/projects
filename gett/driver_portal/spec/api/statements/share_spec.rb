require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'Statements API' do
  path '/statements/share' do
    post 'Sends PDFs with statements data to multiple emails' do
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
                    },
                    emails: {
                      type: :array,
                      items: {
                        type: :string
                      },
                      description: 'List of emails where CSV should be sent',
                      example: ['aaa@mail.com', 'bbb@mail.com']
                    },
                    body: {
                      type: :string,
                      description: 'Text to be inserted into email'
                    }
                 }
              }

      let(:statements) { create_list(:statement, 2) }

      let(:body) do
        {
          ids: statements.map(&:external_id),
          emails: ['aaa@mail.com', 'bbb@mail.com'],
          body: 'Lorem ipsum'
        }
      end

      user_authentication_required!

      response '200', 'PDFs sent successfully' do
        run_test!
      end
    end
  end
end
