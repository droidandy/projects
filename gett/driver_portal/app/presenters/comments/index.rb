module Comments
  class Index < ApplicationPresenter
    attr_reader :comments, :current_user

    def initialize(comments, current_user)
      @comments = comments
      @current_user = current_user
    end

    def as_json
      {
        comments: @comments.map { |comment| Comments::Show.new(comment, current_user).as_json }
      }
    end
  end
end
