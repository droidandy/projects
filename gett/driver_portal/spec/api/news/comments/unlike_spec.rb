require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'News API' do
  path '/news/{news_id}/comments/{id}/likes' do
    delete 'Removes like from given comment' do
      tags 'News'

      consumes 'application/json'

      parameter name: :news_id, in: :path, type: :integer
      parameter name: :id, in: :path, type: :integer

      user_authentication_required!

      let!(:news_item) { create(:news_item) }
      let!(:comment) { create(:comment, commentable: news_item) }
      let!(:like) { create :like, user: current_user, likeable: comment }
      let(:news_id) { news_item.id }
      let(:id) { comment.id }

      response '200', 'successfully removed like' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/comment'
        }

        run_test!
      end
    end
  end
end
