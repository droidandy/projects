module News
  module Items
    class Search < ApplicationQuery
      SORTABLE_COLUMNS = %w[
        author
        comments_count
        created_at
        likes_count
        published_at
        title
        trending_index
        views_count
      ].freeze

      base_scope { News::ItemPolicy::Scope.new(current_user, News::Item.all).resolve }

      searchable_by :id, :author

      query_by(:page, :per_page) do |page, per|
        scope.page(page).per(per)
      end

      sift_by :sort_column, :sort_direction do |column, direction|
        guard { column.to_s.downcase.in?(SORTABLE_COLUMNS) }
        guard { direction.to_s.downcase.in?(%w[asc desc]) }

        base_scope { |scope| scope.order(column => direction) }

        query_by(sort_column: 'author') do
          scope.includes(:author).reorder("users.last_name #{direction}, users.first_name #{direction}")
        end
      end
    end
  end
end
