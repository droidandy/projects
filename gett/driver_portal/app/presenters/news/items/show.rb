module News
  module Items
    class Show < ApplicationPresenter
      attr_reader :item

      COLUMNS_TO_SHOW = %i[
        id
        title
        content
        published_at
        state
        item_type
        comments_count
        views_count
        number
      ].freeze

      def initialize(item)
        @item = item
      end

      def as_json
        convert_to_json(item, only: COLUMNS_TO_SHOW) do |json|
          json[:image_url] = item.image.full_url
          json[:author] = {
            id: item.author.id,
            name: item.author.name
          }
          json[:published] = item.published?
          json[:image_name] = item.image.try(:file).try(:filename)
        end
      end
    end
  end
end
