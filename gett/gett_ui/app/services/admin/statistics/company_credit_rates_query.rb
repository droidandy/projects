using Sequel::CoreRefinements

class Admin::Statistics::CompanyCreditRatesQuery < ::Parascope::Query
  base_scope do
    CompanyCreditRate.dataset
  end

  query_by(group: 'date')  { scope.select_group { |r| r.date(:created_at).as(:date) } }
  query_by(group: 'month') { scope.select_group { |r| r.date_trunc('month', :created_at).as(:date) } }

  query_by(value: 'all') { scope.select_append { avg(:value).cast(:integer).as(:value) } }

  def values
    resolved_scope.all.map(&:values)
  end
end
