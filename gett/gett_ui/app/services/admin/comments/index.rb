module Admin
  module Comments
    class Index < ApplicationService
      include ApplicationService::ModelMethods

      def execute!
        { items: comment_items }
      end

      private def comment_items
        @comment_items ||=
          comments_dataset.order(:created_at).eager(:author).all.map do |comment|
            Admin::Comments::Show.new(comment: comment).execute.result
          end
      end
    end
  end
end
