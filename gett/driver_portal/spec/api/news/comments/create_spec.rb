require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'News API' do
  path '/news/{news_id}/comments' do
    post 'Creates comment for news item' do
      tags 'News'

      consumes 'application/json'

      parameter name: :news_id, in: :path, type: :integer
      parameter name: :body,
                in: :body,
                description: 'Body',
                schema: {
                  type: :object,
                  properties: {
                    content: {
                      type: :string
                    }
                 }
              }

      let(:body) do
        {
          content: 'Content'
        }
      end

      user_authentication_required!

      let!(:news_item) { create(:news_item) }
      let(:news_id) { news_item.id }

      response '200', 'successfully created comment' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/comment'
        }

        run_test!
      end
    end
  end
end
