module News
  module Images
    class Search < ApplicationQuery
      base_scope { News::ImagePolicy::Scope.new(current_user, News::Image.all).resolve }

      query_by(:id) { |id| scope.where(id: id) }
      searchable_by :binding_hash
    end
  end
end
