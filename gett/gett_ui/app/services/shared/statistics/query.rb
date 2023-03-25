using Sequel::CoreRefinements

class Shared::Statistics::Query < ::Parascope::Query
  base_scope do
    Booking
      .dataset
      .exclude(payment_method: 'personal_payment_card')
  end

  query { scope.association_join(company_info: :company) }

  query_by(:final) { scope.final }
  query_by(:company_id) { |company_id| scope.where(:company[:id] => company_id) }
  query_by(:completed) { scope.completed }
  query_by(:for_period) do |period|
    scope.where(booking_timestamp => period)
  end

  query_by(group: 'month') { scope.select_group{ |r| r.date_trunc('month', booking_timestamp).as(:date) } }
  query_by(group: 'date')  { scope.select_group{ |r| r.date(booking_timestamp).as(:date) } }
  query_by(group: 'day')   { scope.select_group{ |r| r.date_part('day', booking_timestamp).as(:date) } }
  query_by(group: 'vehicle_name') do
    scope.association_join(:vehicle).select_group(
      Vehicle::FALLBACKS.transform_keys{ |fb_name| {:vehicle[:name] => fb_name} }.case(:vehicle[:name]).as(:name)
    )
  end
  query_by(group: 'schedule_type') { scope.select_group(:bookings[:asap].as(:name)) }
  query_by(group: 'company_type')  { scope.select_group(:company[:company_type].as(:name)) }
  query_by(group: 'city') do
    scope
      .association_join(booking_addresses: :address).where(:booking_addresses[:address_type] => 'pickup')
      .select_group(:address[:city].as(:name))
  end
  query_by(group: 'company_name') do
    # this query is to group bookings by booking.company.company_info.name and not by booking.company_info.name

    scope
      .left_join(:company_infos.as(:current_company_infos), company_id: :company[:id], active: true)
      .select_group(:current_company_infos[:name].as(:name))
  end

  sift_by(:count) do
    query_by(count: 'all') { scope.select_append{ count('*').as(:value) } }
    query_by(count: 'bookers') { scope.select_append{ count(:booker_id).distinct.as(:value) } }
    query_by(count: 'companies') { scope.select_append{ count(:company[:id]).distinct.as(:value) } }

    query_by(count: 'passengers') do
      scope.select_append do
        {
          Company::Type::ENTERPRISE => count(:passenger_id).distinct,
          Company::Type::AFFILIATE => count(:passenger_phone).distinct
        }.case(0, :company[:company_type]).as(:value)
      end
    end

    query_by(:count_values, count_column: 'vehicle_name') do |values|
      scope
        .association_join(:vehicle)
        .select_append do
          values.map{ |name| sum({ name => 1 }.case(0, :vehicle[:name])).as(name) }
        end
    end

    query_by(:count_values, count_column: 'payment_method') do |values|
      scope.select_append do
        values.map do |payment_method|
          sum({ payment_method => 1 }.case(0, :payment_method)).as(payment_method)
        end
      end
    end

    query_by(:count_values, count_column: 'status') do |values|
      scope.select_append do
        values.map{ |status| sum({ status => 1 }.case(0, :status)).as(status) }
      end
    end
  end

  sifter(:spend) do
    query { scope.association_join(:charges) }

    query_by(spend: 'booking_type') do
      scope.select_append do
        [
          sum({ true => :charges[:total_cost] / 100.0 }.case(0, :bookings[:phone_booking])).cast(:integer).as(:phone),
          sum({ false => :charges[:total_cost] / 100.0 }.case(0, :bookings[:phone_booking])).cast(:integer).as(:web)
        ]
      end
    end

    query_by(spend: 'current_and_previous_month') do
      scope.select_append do
        [
          sum({ Date.current.beginning_of_month => :charges[:total_cost] / 100.0 }
            .case(0, date_trunc('month', :bookings[:scheduled_at]))
          ).cast(:integer).as(:current),
          sum({ Date.current.beginning_of_month - 1.month => :charges[:total_cost] / 100.0 }
            .case(0, date_trunc('month', :bookings[:scheduled_at]))
          ).cast(:integer).as(:previous)
        ]
      end
    end

    query_by(spend: 'all') do
      scope.select_append{ sum(:charges[:total_cost] / 100.0).cast(:integer).as(:spend) }
    end

    query_by(spend: 'waiting_cost') do
      scope.select_append{ sum(:charges[:paid_waiting_time_fee] / 100.0).cast(:integer).as(:spend) }
    end

    query_by(:spend_values, spend_column: 'average_cost_per_vehicle') do |values|
      scope
        .association_join(:vehicle)
        .select_append do
          values.map do |vehicle_name|
            coalesce(avg({ vehicle_name => :charges[:total_cost] / 100.0 }.case(nil, :vehicle[:name])), 0)
              .cast(:integer).as(vehicle_name)
          end
        end
    end
  end

  def initialize(*)
    super

    if params[:count].is_a?(Hash)
      params.merge!(
        count_column: params[:count][:column],
        count_values: params[:count][:values]
      )
    end

    if params[:spend].is_a?(Hash)
      params.merge!(
        spend_column: params[:spend][:column],
        spend_values: params[:spend][:values]
      )
    end
  end

  def values
    resolved_scope.all.map(&:values)
  end

  private def booking_timestamp
    :bookings[:scheduled_at]
  end
end
