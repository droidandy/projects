require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'News API' do
  path '/news/{id}' do
    get 'Responds with news item data' do
      tags 'News'

      consumes 'application/json'

      parameter name: :id, in: :path, type: :integer

      let!(:news_item) { create :news_item }
      let(:id) { news_item.id }

      user_authentication_required!

      response '200', 'successfully requested news item data' do
        schema '$ref' => '#/definitions/news_item'

        run_test!
      end

      response '404', 'news item not found' do
        let(:id) { 0 }

        run_test!
      end
    end
  end
end
