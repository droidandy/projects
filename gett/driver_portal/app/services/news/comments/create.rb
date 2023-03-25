module News
  module Comments
    class Create < ApplicationService
      attr_reader :comment

      schema do
        required(:content).filled(:str?)
        required(:news_item_id).filled(:int?)
        optional(:parent_id).filled(:int?)
      end

      def execute!
        unless news_item
          fail!(errors: { news_item: 'not found' })
          return
        end

        @comment = Comment.new content: content,
                               user: current_user,
                               commentable: news_item

        @comment.parent = parent_comment if parent_id

        @comment.save ? success! : fail!
      end

      on_success { news_item.increment! :comments_count } # rubocop:disable Rails/SkipsModelValidations
      on_fail { errors!(comment.errors.to_h) if comment.present? }

      private def news_item
        @news_item ||= begin
          search = News::Items::Search.new({ id: news_item_id }, current_user: current_user)
          search.one
        end
      end

      private def parent_comment
        @parent_comment ||= begin
          return unless parent_id
          search = ::Comments::Search.new({ id: parent_id, commentable: news_item }, current_user: current_user)
          search.one
        end
      end
    end
  end
end
