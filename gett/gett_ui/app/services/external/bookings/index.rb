module External::Bookings
  class Index < ApplicationService
    include ApplicationService::Context

    attributes :query

    delegate :company, to: :context

    def execute!
      {items: booking_items}.tap do |result|
        result.merge!(pagination: query_service.pagination_data) if query_service.paginated?
      end
    end

    private def query_service
      @query_service ||= Bookings::Query.new(dataset: company.bookings_dataset, query: query, common: true)
    end

    private def booking_items
      query_service.execute.result
        .eager(
          :company,
          :vehicle,
          :pickup_address,
          :destination_address,
          :stop_addresses,
          :booker,
          :passenger,
          :booker_references,
          :driver,
          :charges,
          :invoices,
          :payments,
          alerts: ->(ds) { ds.pending }
        )
        .all
        .map{ |booking| ::Bookings::Show.new(booking: booking).execute.result }
    end
  end
end
