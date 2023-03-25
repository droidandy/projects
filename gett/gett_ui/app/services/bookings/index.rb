module Bookings
  class Index < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy
    include ApplicationService::ReadOnlyDatabase

    attributes :query

    delegate :company, to: :context

    def execute!
      with_read_only_database do
        {items: booking_items, payment_methods: payment_methods}.tap do |result|
          result.merge!(pagination: query_service.pagination_data) if query_service.paginated?
        end
      end
    end

    private def query_service
      @query_service ||= Bookings::Query.new(dataset: policy_scope, query: query, common: true)
    end

    private def payment_methods
      company.payment_types.flat_map do |type|
        (type == 'passenger_payment_card') ? ['personal_payment_card', 'business_payment_card'] : type
      end
    end

    private def booking_items
      query_service.execute.result
        .eager(
          :company,
          :vehicle,
          :pickup_address,
          :destination_address,
          :stop_addresses,
          :passenger,
          :driver,
          :charges,
          alerts: ->(ds) { ds.pending }
        )
        .all
        .map do |booking|
          if company.affiliate?
            Show.new(booking: booking).execute.result
          else
            Row.new(booking: booking, map_size: query&.dig(:map_size)).execute.result
          end
        end
    end
  end
end
