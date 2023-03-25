using Sequel::CoreRefinements
using HomePrivacy::SequelRefinements

module Shared::Invoices
  class Export < ApplicationService
    include ApplicationService::CsvExport
    include ApplicationService::DbHelpers

    MAKE_HEADERS =
      lambda do |extra|
        {
          invoice_id:                    'Invoice Number',
          company_cost_center:           'Company Cost Center',
          booking_id:                    'Service ID',
          booking_status:                'Status',
          booking_created_at:            'Created At',
          booking_scheduled_at:          'Scheduled At',
          booking_arrived_at:            'Arrived At',
          booking_started_at:            'Started At',
          booking_ended_at:              'Ended At',
          booking_cancelled_at:          'Cancelled At',
          vendor:                        'Vendor',
          vehicle_type:                  'Car Type',
          passenger_name:                'Riding User Name',
          passenger_email:               'Riding User Email',
          passenger_payroll:             'Riding User Payroll ID',
          passenger_division:            'Riding User Division',
          passenger_work_role:           'Riding User Work Role',
          passenger_department:          'Riding User Department',
          passenger_id:                  'Riding User Employee ID',
          booker_name:                   'Ordering User Name',
          **extra,
          reason_for_travel:             'Reason For Travel',
          pickup_address:                'Origin Address',
          destination_address:           'Destination Address',
          payment_type:                  'Payment Type',
          ride_cost_vatable:             'Ride Cost (VATable)',
          ride_cost_non_vatable:         'Ride Cost (Non-VATable)',
          waiting_time:                  'Waiting Time',
          waiting_time_cost_vatable:     'Waiting Time Cost (VATable)',
          waiting_time_cost_non_vatable: 'Waiting Time Cost (Non-VATable)',
          cancellation_cost:             'Cancellation Cost',
          run_in_fee:                    'Run-in Fee',
          booking_fee:                   'Booking Fee',
          phone_booking_fee:             'Phone Booking Fee',
          handling_fee:                  'Handling Fee',
          international_fee:             'International Fee',
          extra1:                        'Extra Charge 1',
          extra2:                        'Extra Charge 2',
          extra3:                        'Extra Charge 3',
          total_fees:                    'Total Fees',
          total_vatable:                 'Total VATable',
          total_non_vatable:             'Total Non-VATable',
          vat:                           'VAT',
          total_cost_incl_vat:           'Total Cost Incl VAT'
        }
      end

    def execute!
      to_csv(orders)
    end

    def csv_headers
      MAKE_HEADERS[reference_headers]
    end

    def reference_headers
      @reference_headers ||=
        reference_names.reduce({}) do |r, name|
          r.merge!(name.to_sym => name)
        end
    end

    private def invoice_ids
      fail "#{self.class.name} doesn't implement #{__method__}"
    end

    private def invoice_order_ids
      @invoice_order_ids ||=
        Booking
          .association_join(:invoices)
          .where(:invoices[:id] => invoice_ids)
          .select_map(:bookings[:id])
    end

    private def all_order_ids
      invoice_order_ids
    end

    private def orders
      invoice_orders_dataset.all.uniq(&:id)
    end

    private def invoice_orders_dataset
      orders_scope
        .association_join(:invoices)
        .where(:bookings[:id] => invoice_order_ids)
    end

    private def orders_scope
      refs_hstore = Sequel.hstore_op(:references[:refs_hstore])

      @orders_scope ||=
        orders_base_scope
          .left_join(booking_references_dataset.as(:references), booking_id: :bookings[:id])
          .select_append(*reference_names.map{ |name| refs_hstore[name].as(name) })
    end

    private def reference_names
      @reference_names ||=
        Booking
          .where(:bookings[:id] => all_order_ids)
          .left_join(:booker_references.as(:book_refs), booking_id: :bookings[:id])
          .distinct(:book_refs[:booking_reference_name])
          .select_map(:book_refs[:booking_reference_name])
          .compact
    end

    private def orders_base_scope
      Booking
        .join(:vehicles, id: :bookings[:vehicle_id])
        .left_join(:travel_reasons, id: :bookings[:travel_reason_id])
        .join(:company_infos, id: :bookings[:company_info_id])
        .join(:companies, id: :company_infos[:company_id])
        .left_join(:booking_addresses.as(:pickup_bas), booking_id: :bookings[:id], address_type: 'pickup')
        .left_join(:booking_addresses.as(:dest_bas), booking_id: :bookings[:id], address_type: 'destination')
        .left_join(:addresses.as(:pickup_addresses), id: :pickup_bas[:address_id])
        .left_join(:addresses.as(:destination_addresses), id: :dest_bas[:address_id])
        .left_join(:members.as(:passengers), id: :bookings[:passenger_id])
        .left_join(:users.as(:passenger_accounts), id: :passengers[:id])
        .left_join(:work_roles, id: :passengers[:work_role_id])
        .left_join(:departments, id: :passengers[:department_id])
        .left_join(:users.as(:booker_accounts), id: :bookings[:booker_id])
        .left_join(:booking_charges.as(:charges), booking_id: :bookings[:id])
        .where{ (:charges[:id] !~ nil) & ((:charges[:total_cost] > 0) | (:bookings[:status] =~ 'completed')) }
        .select(
          :bookings[:id].as(:id),
          :companies[:id].as(:company_id),
          :invoices[:id].as(:invoice_id),
          Sequel.function(:coalesce, booking_order_id, 'N/A').as(:booking_id),
          :bookings[:status].as(:booking_status),
          format_time(:bookings[:created_at], timezone: :pickup_addresses[:timezone]).as(:booking_created_at),
          format_time(:bookings[:scheduled_at], timezone: :pickup_addresses[:timezone]).as(:booking_scheduled_at),
          format_time(:bookings[:arrived_at], timezone: :pickup_addresses[:timezone]).as(:booking_arrived_at),
          format_time(:bookings[:started_at], timezone: :pickup_addresses[:timezone]).as(:booking_started_at),
          format_time(:bookings[:ended_at], timezone: :pickup_addresses[:timezone]).as(:booking_ended_at),
          format_time(:bookings[:cancelled_at], timezone: :pickup_addresses[:timezone]).as(:booking_cancelled_at),
          :vehicles[:service_type].as(:vendor),
          :vehicles[:name].as(:vehicle_type),
          {
            {:bookings[:passenger_id] => nil} => Sequel.function(:concat, :bookings[:passenger_first_name], ' ', :bookings[:passenger_last_name])
          }.case(
            Sequel.join([:passenger_accounts[:first_name], ' ', :passenger_accounts[:last_name]])
          ).as(:passenger_name),
          :passenger_accounts[:email].as(:passenger_email),
          :passengers[:payroll].as(:passenger_payroll),
          :passengers[:division].as(:passenger_division),
          :work_roles[:name].as(:passenger_work_role),
          :departments[:name].as(:passenger_department),
          :passengers[:id].as(:passenger_id),
          Sequel.join([:booker_accounts[:first_name], ' ', :booker_accounts[:last_name]]).as(:booker_name),
          :travel_reasons[:name].as(:reason_for_travel),
          :pickup_addresses[:line].sanitize_using(:pickup_bas[:passenger_address_type]).as(:pickup_address),
          :destination_addresses[:line].sanitize_using(:dest_bas[:passenger_address_type]).as(:destination_address),
          :bookings[:payment_method].as(:payment_type),
          format_cents(
            {
              {:bookings[:status] => 'cancelled'} => 0,
              {:vehicles[:service_type] => 'ot'} => :charges[:fare_cost]
            }.case(0)
          ).as(:ride_cost_vatable),
          format_cents(
            {
              {:bookings[:status] => 'cancelled'} => 0,
              {:vehicles[:service_type] => 'ot'} => 0
            }.case(:charges[:fare_cost])
          ).as(:ride_cost_non_vatable),
          seconds_to_time_text(:charges[:paid_waiting_time]).as(:waiting_time),
          format_cents(
            {
              {:vehicles[:service_type] => 'ot'} => :charges[:paid_waiting_time_fee]
            }.case(0)
          ).as(:waiting_time_cost_vatable),
          format_cents(
            {
              {:vehicles[:service_type] => 'ot'} => 0
            }.case(:charges[:paid_waiting_time_fee])
          ).as(:waiting_time_cost_non_vatable),
          format_cents(:charges[:cancellation_fee]).as(:cancellation_cost),
          format_cents(:charges[:run_in_fee]).as(:run_in_fee),
          format_cents(:charges[:booking_fee]).as(:booking_fee),
          format_cents(:charges[:phone_booking_fee]).as(:phone_booking_fee),
          format_cents(:charges[:handling_fee]).as(:handling_fee),
          format_cents(:charges[:international_booking_fee]).as(:international_fee),
          format_cents(:charges[:extra1]).as(:extra1),
          format_cents(:charges[:extra2]).as(:extra2),
          format_cents(:charges[:extra3]).as(:extra3),
          format_cents(:charges[:vat]).as(:vat),
          format_cents(
            :charges[:handling_fee] +
            :charges[:run_in_fee] +
            :charges[:booking_fee] +
            :charges[:paid_waiting_time_fee] +
            :charges[:stops_fee] +
            :charges[:extra1] +
            :charges[:extra2] +
            :charges[:extra3] +
            :charges[:phone_booking_fee] +
            :charges[:cancellation_fee] +
            :charges[:tips]
          ).as(:total_fees),
          format_cents(
            :charges[:vatable_ride_fees] +
            :charges[:service_fees] +
            :charges[:vatable_extra_fees]
          ).as(:total_vatable),
          format_cents(
            :charges[:non_vatable_ride_fees] +
            :charges[:non_vatable_extra_fees]
          ).as(:total_non_vatable),
          format_cents(:charges[:total_cost] - :charges[:vat]).as(:final_cost_excl_vat),
          format_cents(:charges[:total_cost]).as(:total_cost_incl_vat),
          :company_infos[:cost_centre].as(:company_cost_center)
        )
    end
  end
end
