class Likes::Create < ApplicationService
  schema do
    required(:comment_id).filled(:int?)
    required(:value).filled(included_in?: %w[1 -1])
  end

  def execute!
    raise ActiveRecord::RecordNotFound unless comment

    like.value = value

    like.save! ? success! : fail!
  end

  on_success :count_likes

  def like
    @like ||= Like.find_or_initialize_by(likeable: comment, user: current_user)
  end

  def comment
    @comment = begin
      search = Comments::Search.new({ id: comment_id }, current_user: current_user)
      search.one
    end
  end

  private def count_likes
    comment.update likes_count: comment.likes.where(value: 1).count,
                   dislikes_count: comment.likes.where(value: -1).count
  end
end
