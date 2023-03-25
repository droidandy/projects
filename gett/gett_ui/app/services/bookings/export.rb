module Bookings
  class Export < ApplicationService
    include ApplicationService::CsvExport
    include ApplicationService::Policy
    include ApplicationService::Context
    include HomePrivacy::AddressHelpers

    attributes :query

    CSV_HEADERS = {
      id:                  'Id',
      created_at:          'Created at',
      message:             'Message to driver',
      status:              'Status',
      cancellation:        'Cancellation',
      total_cost:          'Total cost',
      total_cost_excl_vat: 'Total cost excl. VAT',
      passenger_name:      'Passenger name',
      passenger_phone:     'Passenger phone',
      pickup_address:      'Pickup address',
      destination_address: 'Destination address',
      vehicle_type:        'Vehicle type',
      booker_name:         'Booker name',
      references:          'References',
      travel_reason:       'Travel reason',
      scheduled_at:        'Scheduled at',
      driver_name:         'Driver name',
      driver_rating:       'Driver rating',
      department:          'Department',
      work_role:           'Work role',
      cancelled_by:        'Cancelled by',
      payroll_id:          'Payroll ID',
      cost_centre:         'Cost centre',
      division:            'Division',
      payment_type:        'Payment type'
    }.freeze

    def execute!
      to_csv(bookings.map{ |b| booking_item(b) })
    end

    private def booking_item(booking)
      {
        id:                  booking.service_id,
        created_at:          local_time(booking.created_at),
        message:             booking.message,
        status:              booking.status.humanize,
        cancellation:        cancellation_cost(booking),
        total_cost:          total_cost(booking),
        total_cost_excl_vat: total_cost_excl_vat(booking),
        passenger_name:      booking.passenger_info[:full_name],
        passenger_phone:     booking.passenger_info[:phone_number],
        pickup_address:      safe_address_line(booking.pickup_address),
        destination_address: safe_address_line(booking.destination_address),
        vehicle_type:        booking.vehicle.name,
        booker_name:         booking.booker.full_name,
        references:          references_for(booking),
        travel_reason:       booking.travel_reason&.name || 'Other',
        scheduled_at:        local_time(booking.scheduled_at),
        driver_name:         booking.driver&.name,
        driver_rating:       booking.driver&.rating,
        department:          booking.passenger&.department&.name,
        work_role:           booking.passenger&.work_role&.name,
        cancelled_by:        booking.cancelled_by&.full_name,
        payroll_id:          booking.passenger&.payroll,
        cost_centre:         booking.passenger&.cost_centre,
        division:            booking.passenger&.division,
        payment_type:        booking.payment_method
      }
    end

    private def total_cost(booking)
      formatted_cost(booking.charges&.total_cost)
    end

    private def formatted_cost(cost)
      (cost.to_f / 100).round(2)
    end

    private def total_cost_excl_vat(booking)
      formatted_cost(booking.charges&.total_cost.to_f - booking.charges&.vat.to_f)
    end

    private def cancellation_cost(booking)
      booking.cancelled? ? total_cost(booking) : 0.0
    end

    private def local_time(time)
      time.in_time_zone(Settings.time_zone).strftime('%d/%m/%Y %H:%M')
    end

    private def references_for(booking)
      booking.booker_references
        .map{ |br| br.value.blank? ? br.booking_reference_name : "#{br.booking_reference_name}: #{br.value}" }
        .join(',')
    end

    private def bookings
      @bookings ||= bookings_dataset
        .eager(:vehicle, :pickup_address, :destination_address, :booker, :passenger, :booker_references)
        .all
    end

    private def bookings_dataset
      @bookings_dataset = Query.new(query: query, dataset: policy_scope.final, common: true).execute.result
    end

    private def csv_headers
      CSV_HEADERS
    end

    def self.policy_class
      Bookings::IndexPolicy
    end
  end
end
