require 'rails_helper'
require 'swagger_helper'

RSpec.describe 'News API' do
  path '/news/{id}' do
    delete 'Destroy news item' do
      tags 'News'

      consumes 'application/json'

      parameter name: :id, in: :path, type: :integer

      user_authentication_required! current_user_traits: %i[with_community_manager_role]

      let!(:news_item) { create :news_item }
      let(:id) { news_item.id }

      response '200', 'successfully update news item' do
        run_test!
      end
    end
  end
end
