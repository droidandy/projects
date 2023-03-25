module News
  module Items
    class Index < ApplicationPresenter
      attr_reader :items

      def initialize(items)
        @items = items
      end

      def as_json
        {
          news: @items.map { |item| presenter_for(item).as_json },
          total: @items.total_count,
          page: @items.current_page,
          per_page: @items.current_per_page
        }
      end
    end
  end
end
