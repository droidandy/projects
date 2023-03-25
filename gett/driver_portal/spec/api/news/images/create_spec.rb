require 'rails_helper'
require 'swagger_helper'
include ActionDispatch::TestProcess

RSpec.describe 'News API' do
  path '/news/{news_id}/images' do
    post 'Creates image to be pasted into given news item content' do
      tags 'News'

      consumes 'multipart/form-data'

      parameter name: :news_id, in: :path, type: :integer
      parameter name: :image,
                in: :formData,
                type: :file

      user_authentication_required!

      let(:image) { fixture_file_upload('1x1.jpg') }
      let(:news_id) { create(:news_item).id }

      response '200', 'successfully create image' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/news_image'
        }

        run_test!
      end
    end
  end
end
