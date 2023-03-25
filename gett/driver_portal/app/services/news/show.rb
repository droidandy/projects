module News
  class Show < ApplicationService
    TRENDING_PERIOD = 1.month

    schema do
      required(:news_item_id).filled(:int?)
    end

    def execute!
      raise ActiveRecord::RecordNotFound unless news_item

      if current_user.admin?
        success!
      else
        super do
          news_item.views.create user: current_user
          news_item.increment! :views_count # rubocop:disable Rails/SkipsModelValidations
          news_item.update trending_index: trending_index
        end
      end
    end

    def news_item
      @news_item ||= begin
        search = News::Items::Search.new({ id: news_item_id }, current_user: current_user)
        search.one
      end
    end

    private def trending_index
      news_item.views.where('created_at > ?', Time.current - TRENDING_PERIOD).count
    end
  end
end
