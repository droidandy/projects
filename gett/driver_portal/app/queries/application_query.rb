class ApplicationQuery < Parascope::Query
  def execute
    scope = resolved_scope
    block_given? ? yield(scope) : scope
  end

  def one
    scope = resolved_scope
    block_given? ? yield(scope.first) : scope.first
  end

  delegate :count, :exists?, to: :resolved_scope

  def self.searchable_by(*columns)
    Array.wrap(columns).each do |column|
      query_by(column) { |column_value| scope.where(column => column_value) }
    end
  end
end
