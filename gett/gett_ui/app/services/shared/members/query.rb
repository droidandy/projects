module Shared::Members
  class Query < ::Parascope::Query
    query_by(:search) do |search|
      search = "%#{search.gsub(/\s/, ' ')}%"
      name_parts = [:first_name, ' ', :last_name]

      scope.grep(
        [
          :first_name,
          :last_name,
          Sequel.join(name_parts),
          Sequel.join(name_parts.reverse),
          :email,
          :phone
        ],
        search,
        case_insensitive: true
      )
    end

    query_by(:order) do |column|
      column = column.underscore

      guard { column.in? %w(id first_name last_name phone email) }
      scope.order(column.to_sym)
    end

    query_by(:reverse) { scope.reverse }

    query_by(:page, :per_page, index: :last) { |page, per| scope.paginate(page.to_i, per.to_i) }
  end
end
