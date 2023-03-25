using Sequel::CoreRefinements

module Admin::Bookings
  class Index < ApplicationService
    include ApplicationService::ReadOnlyDatabase
    attributes :query, :invoice_id

    def execute!
      with_read_only_database do
        {
          items: booking_items,
          counts: booking_counts,
          companies: companies_data,
          vendors_list: vendors_data,
          pagination: query_service.pagination_data
        }
      end
    end

    private def query_service
      @query_service ||= ::Bookings::Query.new(dataset: bookings_dataset, query: query, admin: true)
    end

    private def bookings_dataset
      for_credit_note? ? invoice.bookings_dataset : Booking.dataset
    end

    private def booking_items
      query_service.execute.result
        .eager(
          :vehicle,
          :pickup_address,
          :destination_address,
          :stop_addresses,
          :passenger,
          :driver,
          :charges,
          :invoices,
          :payments,
          company: :company_info,
          alerts: ->(ds) { ds.pending }
        )
        .all
        .map{ |booking| Row.new(booking: booking, with_charges: for_credit_note?).execute.result }
    end

    private def booking_counts
      status_counts.merge(alert: alerts_count, critical: critical_count)
    end

    private def status_counts
      DB[:bookings]
        .select do
          [
            sum({{status: Booking::ACTIVE_STATUSES} => 1}.case(0)).as(:active),
            sum({{status: Booking::FUTURE_STATUSES} => 1}.case(0)).as(:future)
          ]
        end
        .where(status: Booking::ACTIVE_STATUSES + Booking::FUTURE_STATUSES)
        .first
        .transform_values{ |sum| sum || 0 }
    end

    private def alerts_count
      DB[:bookings]
        .where do
          (status =~ Booking::ALERT_STATUSES) |
          (DB[:alerts].where{ (booking_id =~ :bookings[:id]) & (resolved =~ false) }.select(1).exists)
        end
        .count
    end

    private def critical_count
      Booking.not_final.critical.count
    end

    private def companies_data
      Admin::Companies::Lookup.new.execute.result
    end

    private def vendors_data
      Admin::Vendors::Lookup.new.execute.result
    end

    private def for_credit_note?
      invoice_id.present?
    end

    private def invoice
      return unless for_credit_note?

      @invoice ||= Invoice.with_pk!(invoice_id)
    end
  end
end
