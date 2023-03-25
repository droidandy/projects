module Admin
  module Comments
    class Show < ApplicationService
      attributes :comment

      def execute!
        comment.as_json(
          only: [:id, :text, :created_at],
          include: {
            author: { only: [:full_name, :avatar_url] }
          }
        )
      end
    end
  end
end
