module News
  class Destroy < ApplicationService
    schema do
      required(:news_item_id).filled(:int?)
    end

    def execute!
      raise ActiveRecord::RecordNotFound unless news_item
      authorize! news_item

      news_item.destroy ? success! : fail!
    end

    def news_item
      @news_item ||= begin
        search = News::Items::Search.new({ id: news_item_id }, current_user: current_user)
        search.one
      end
    end
  end
end
