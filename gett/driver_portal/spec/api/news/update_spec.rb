require 'rails_helper'
require 'swagger_helper'
include ActionDispatch::TestProcess

RSpec.describe 'News API' do
  path '/news/{id}' do
    put 'Updates news item' do
      tags 'News'

      consumes 'multipart/form-data'

      parameter name: :id, in: :path, type: :integer
      parameter name: :title,
                in: :formData,
                type: :string
      parameter name: :published_at,
                in: :formData,
                type: :string,
                format: 'date-time'
      parameter name: :item_type,
                in: :formData,
                type: :string,
                enum: %w[regular featured numbers]
      parameter name: :content,
                in: :formData,
                type: :string,
                required: false
      parameter name: :image,
                in: :formData,
                type: :file,
                required: false
      parameter name: :number,
                in: :formData,
                type: :integer,
                required: false

      user_authentication_required! current_user_traits: %i[with_community_manager_role]

      let!(:news_item) { create :news_item }
      let(:id) { news_item.id }
      let(:title) { 'Title' }
      let(:published_at) { Time.current.iso8601 }
      let(:item_type) { 'regular' }
      let(:image) { fixture_file_upload('1x1.jpg') }
      let(:content) { '<div>Hello</div>' }

      response '200', 'successfully update news item' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/news_item'
        }

        run_test!
      end
    end
  end
end
