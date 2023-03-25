module Comments
  class Show < ApplicationPresenter
    attr_reader :comment, :current_user

    COLUMNS_TO_SHOW = %i[
      id
      dislikes_count
      content
      created_at
      likes_count
    ].freeze

    def initialize(comment, current_user)
      @comment = comment
      @current_user = current_user
    end

    def as_json
      convert_to_json(comment, only: COLUMNS_TO_SHOW) do |json|
        json[:user] = {
          id: comment.user.id,
          name: comment.user.name,
          avatar_url: comment.user.avatar.full_url
        }
        json[:comments] = subcomments.map { |subcomment| Comments::Show.new(subcomment, current_user).as_json }
        json[:current_user_value] = comment.likes.find_by(user: current_user).try(:value)
      end
    end

    private def subcomments
      Comments::Search.new({ parent: comment }, current_user: current_user).resolved_scope
    end
  end
end
