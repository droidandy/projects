class Likes::Destroy < ApplicationService
  schema do
    required(:comment_id).filled(:int?)
  end

  def execute!
    raise ActiveRecord::RecordNotFound unless comment

    unless like
      fail!(errors: { base: 'Comment is not liked' })
      return
    end

    like.destroy
    success!
  end

  on_success :count_likes

  def like
    @like ||= Like.find_by(likeable: comment, user: current_user)
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
