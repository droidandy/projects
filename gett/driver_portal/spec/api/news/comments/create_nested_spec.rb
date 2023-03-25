require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'News API' do
  path '/news/{news_id}/comments/{id}/comments' do
    post 'Creates nested comment for news item comment' do
      tags 'News'

      consumes 'application/json'

      parameter name: :news_id, in: :path, type: :integer
      parameter name: :id, in: :path, type: :integer
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
      let!(:parent_comment) { create(:comment, commentable: news_item) }
      let(:news_id) { news_item.id }
      let(:id) { parent_comment.id }

      response '200', 'successfully created nested comment' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/comment'
        }

        run_test!
      end
    end
  end
end
