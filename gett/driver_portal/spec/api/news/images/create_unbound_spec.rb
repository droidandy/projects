require 'rails_helper'
require 'swagger_helper'
include ActionDispatch::TestProcess

RSpec.describe 'News API' do
  path '/news/images' do
    post 'Creates image to be pasted into new news item content' do
      tags 'News'

      consumes 'multipart/form-data'

      parameter name: :image,
                in: :formData,
                type: :file
      parameter name: :binding_hash,
                in: :formData,
                type: :string

      user_authentication_required!

      let(:image) { fixture_file_upload('1x1.jpg') }
      let(:binding_hash) { 'AbCdEf123456' }

      response '200', 'successfully create image' do
        schema type: :object, properties: {
          '$ref' => '#/definitions/news_image'
        }

        run_test!
      end
    end
  end
end
