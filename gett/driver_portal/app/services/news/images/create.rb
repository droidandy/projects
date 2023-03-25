module News
  module Images
    class Create < ApplicationService
      attr_reader :created_image

      schema do
        required(:image).filled
        optional(:news_item_id).maybe(:int?)
        optional(:binding_hash).maybe(:str?)
      end

      def execute!
        @created_image = ::News::Image.new(attributes)

        @created_image.save ? success! : fail!
      end

      on_fail { errors!(created_image.errors.to_h) if created_image.present? }

      private def attributes
        hash = {
          image: image,
          news_item_id: news_item_id
        }
        hash[:binding_hash] = binding_hash || (SecureRandom.urlsafe_base64 unless news_item_id)
        hash
      end
    end
  end
end
