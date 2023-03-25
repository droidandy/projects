require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'News API' do
  path '/news/{news_id}/comments' do
    get 'Responds with list of comments for news item' do
      tags 'News'

      consumes 'application/json'

      parameter name: :news_id, in: :path, type: :integer

      user_authentication_required!
      let!(:news_item) { create(:news_item) }
      let!(:comments) { create(:comment, commentable: news_item) }
      let(:news_id) { news_item.id }

      response '200', 'successfully requested list of users' do
        schema type: :object, properties: {
          comments: {
            type: :array,
            items: {
              '$ref' => '#/definitions/comment'
            }
          }
        }

        run_test!
      end
    end
  end
end
