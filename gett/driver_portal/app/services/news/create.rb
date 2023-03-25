module News
  class Create < ApplicationService
    attr_reader :news_item

    schema do
      required(:title).filled(:str?)
      required(:published_at).filled(:date_time?)
      required(:item_type).filled(:str?)
      optional(:content).maybe(:str?)
      optional(:image).maybe
      optional(:number).maybe(:int?)
      optional(:binding_hash).maybe(:str?)
    end

    def execute!
      @news_item = ::News::Item.new(attributes)

      authorize! @news_item

      @news_item.save ? success! : fail!
    end

    on_success { bind_images if binding_hash }
    on_fail { errors!(news_item.errors.to_h) if news_item.present? }

    private def bind_images
      search = News::Images::Search.new({ binding_hash: binding_hash }, current_user: current_user)
      images = search.resolved_scope
      ActiveRecord::Base.transaction do
        images.each { |image| image.update binding_hash: nil, news_item: news_item }
      end
    end

    private def attributes
      {
        author: current_user,
        title: title,
        image: image,
        content: content,
        published_at: published_at,
        item_type: item_type,
        number: number
      }
    end
  end
end
