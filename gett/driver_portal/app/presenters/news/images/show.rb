module News
  module Images
    class Show < ApplicationPresenter
      include Rails.application.routes.url_helpers

      attr_reader :image

      COLUMNS_TO_SHOW = %i[
        id
        binding_hash
      ].freeze

      def initialize(image)
        @image = image
      end

      def as_json
        convert_to_json(image, only: COLUMNS_TO_SHOW) do |json|
          json[:image_url] = URI.join(Rails.application.secrets.asset_host, "/api/v1/news/images/#{image.id}").to_s
        end
      end
    end
  end
end
