module Comments
  class Search < ApplicationQuery
    base_scope do
      CommentPolicy::Scope.new(current_user, Comment.all)
        .resolve
        .order(created_at: :asc)
    end

    searchable_by :id, :commentable, :parent

    query_by(:commentable_id, :commentable_type) do |id, type|
      scope.where(commentable_id: id, commentable_type: type)
    end
  end
end
