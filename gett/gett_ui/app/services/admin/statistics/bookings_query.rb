using Sequel::CoreRefinements

class Admin::Statistics::BookingsQuery < Shared::Statistics::Query
  base_scope do
    Booking
      .dataset
      .association_join(company_info: :company)
      .exclude(:company[:fake] => true)
  end

  query_by(:future) { scope.future }
  query_by(:cancelled) { scope.cancelled }
  query_by(:credit) { scope.credit }
  query_by(:account) { scope.account }
  query_by(:cash) { scope.cash }
  query_by(:international) { scope.international }
  query_by(:ftr) { scope.ftr }
  query_by(:active) { scope.live }

  query_by(:company_type) do |company_type|
    scope.where(:company[:company_type] => company_type)
  end

  query_by(group: 'status') { scope.select_group(:bookings[:status].as(:name)) }
  query_by(group: 'service_type') { scope.association_join(:vehicle).select_group(:vehicle[:service_type].as(:name)) }

  query_by(:average_rating) do
    scope
      .association_join(:driver)
      .select{ [round(avg(:driver[:trip_rating]), 1).as(:value), 'driver'.as(:name)] }
      .union(
        scope
          .association_join(:feedbacks)
          .select{ [round(avg(:feedbacks[:rating]), 1), 'service'.as(:name)] },
        all: true
      )
  end
end
