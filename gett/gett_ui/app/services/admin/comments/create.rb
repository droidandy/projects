module Admin
  module Comments
    class Create < ApplicationService
      include ApplicationService::ModelMethods
      include ApplicationService::Context

      attributes :params
      delegate :admin, to: :context

      def execute!
        create_model(comment, params)
      end

      def errors
        humanized_full_messages(comment.errors)
      end

      def comment
        @comment ||= Comment.new(author: admin)
      end

      def show_result
        Admin::Comments::Show.new(comment: comment).execute.result
      end
    end
  end
end
