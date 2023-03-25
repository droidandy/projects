require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'News API' do
  path '/news/{news_id}/comments/{id}/likes' do
    post 'Likes/dislikes given comment' do
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
                    value: {
                      type: :integer,
                      enum: [1, -1],
                      description: '1 for like, -1 for dislike'
                    }
                 }
              }

      let(:body) do
        {
          value: '-1'
        }
      end

      user_authentication_required!

      let!(:news_item) { create(:news_item) }
      let!(:comment) { create(:comment, commentable: news_item) }
      let(:news_id) { news_item.id }
      let(:id) { comment.id }

      response '200', 'successfully likes/dislikes comment' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/comment'
        }

        run_test!
      end
    end
  end
end
