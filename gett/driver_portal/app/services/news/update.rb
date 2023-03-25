module News
  class Update < ApplicationService
    schema do
      required(:news_item_id).filled(:int?)
      required(:title).filled(:str?)
      required(:item_type).filled(:str?)
      optional(:published_at).maybe(:date_time?)
      optional(:content).maybe(:str?)
      optional(:image).maybe
      optional(:number).maybe(:int?)
    end

    def execute!
      unless news_item
        fail!(errors: { news_item: 'not found' })
        return
      end

      authorize! news_item

      news_item.update(attributes) ? success! : fail!
    end

    on_fail { errors!(news_item.errors.to_h) if news_item.present? }

    def news_item
      @news_item ||= begin
        search = News::Items::Search.new({ id: news_item_id }, current_user: current_user)
        search.one
      end
    end

    private def attributes
      hash = {
        title: title,
        content: content,
        published_at: published_at,
        item_type: item_type,
        image: image,
        number: number
      }
      hash.delete :image unless image
      hash
    end
  end
end
