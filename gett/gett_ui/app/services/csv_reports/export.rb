require 'csv'

using Sequel::CoreRefinements
using HomePrivacy::SequelRefinements

module CsvReports
  class Export < ApplicationService
    include ApplicationService::DbHelpers

    attributes :csv_report

    delegate :company, :headers, :recurrence, to: :csv_report

    SUPPORTED_HEADERS = {
      booking_id:            'Order ID',
      company_id:            'Company ID',
      company_name:          'Company Name',
      company_address:       'Company Address',
      company_email:         'Company Email',
      company_contact:       'Company Contact',
      account_manager:       'Account Manager',
      billing_terms:         'Billing Terms',
      booking_scheduled_at:  'Scheduled Order Date/Time',
      booking_created_at:    'Order Creation Date/Time',
      booking_arrived_at:    'Arrived At',
      booking_started_at:    'Started At',
      booking_ended_at:      'Ended At',
      booking_cancelled_at:  'Cancelled At',
      vehicle_type:          'Car Type',
      pickup_address:        'Pickup Address',
      destination_address:   'Destination Address',

      stop_point_1:          'Stop Point 1',
      stop_point_2:          'Stop Point 2',
      stop_point_3:          'Stop Point 3',
      stop_point_4:          'Stop Point 4',
      payment_type:          'Payment Type',
      booker_name:           'Booker Name',
      passenger_id:          'Riding User ID',
      passenger_name:        'Riding User Name',
      passenger_department:  'Riding User Department',
      passenger_work_role:   'Riding User Work Role',
      passenger_cost_centre: 'Riding User Cost Center',
      passenger_division:    'Riding User Division',
      passenger_payroll:     'Riding User Payroll ID',
      passenger_email:       'Riding User Email',

      base_fare:             'Base Fare',
      run_in_fee:            'Run-in Fee',
      booking_fee:           'Booking Fee',
      phone_booking_fee:     'Phone Booking Fee',
      handling_fee:          'Handling Fee',
      international_fee:     'International Fee',
      total_fees:            'Total Fees',
      extra_1:               'Extra Fee 1',
      extra_2:               'Extra Fee 2',
      extra_3:               'Extra Fee 3',
      waiting_time_minutes:  'Waiting Time Minutes',
      waiting_time_cost:     'Waiting Time Cost',
      cancellation_cost:     'Cancellation Cost',
      vat:                   'VAT',
      final_cost_excl_vat:   'Final Cost Excl VAT',
      final_cost_incl_vat:   'Final Cost Incl VAT',
      booking_status:        'Status',
      reason_for_travel:     'Reason For Travel'
    }.freeze

    SUPPORTED_REFERENCES_KEYS = %i(reference_1 reference_2 reference_3 reference_4).freeze
    SUPPORTED_REFERENCES_HEADERS_KEY = :references

    TIMEZONE = 'Europe/London'.freeze

    def execute!
      to_csv
    end

    private def csv_headers
      @csv_headers ||= SUPPORTED_HEADERS.select{ |k, _| headers[k] == 'true' }
    end

    private def refs_headers
      SUPPORTED_REFERENCES_KEYS if headers[SUPPORTED_REFERENCES_HEADERS_KEY] == 'true'
    end

    private def to_csv
      CSV.generate do |csv|
        csv << first_row
        orders.each { |order| csv << row(order) }
      end
    end

    private def first_row
      csv_headers.values + ref_keys
    end

    private def row(order)
      csv_headers.keys.map{ |h| order[h] } + ref_values(order)
    end

    private def ref_keys
      @ref_keys ||= orders.flat_map { |order| real_refs_for(order).keys }.uniq.sort
    end

    private def ref_values(order)
      real_refs = real_refs_for(order)

      ref_keys.map { |ref_key| real_refs[ref_key] }
    end

    private def real_refs_for(order)
      # Fetches real references from orders
      # <Booking @values={:reference_1=>'custom_reference_name: value1',:reference2=>'yes: value2'}
      # will return { 'custom_reference_name' => 'value1', 'yes' => 'value2' }

      order.values.slice(*refs_headers).each_with_object({}) do |(_, ref_data), obj|
        next if ref_data.blank?

        ref_key, ref_value = ref_data.match(/^(.*?): (.*)$/).captures
        obj[ref_key] = ref_value
      end
    end

    private def period
      case recurrence
      when 'monthly'
        (current_date_in_tz - 1.month).beginning_of_month..(current_date_in_tz - 1.month).end_of_month
      when 'weekly'
        (current_date_in_tz - 1.week).beginning_of_week..(current_date_in_tz - 1.week).end_of_week
      when 'daily'
        (current_date_in_tz - 1.day)...current_date_in_tz
      end
    end

    private def current_date_in_tz
      Date.current.in_time_zone(TIMEZONE)
    end

    private def orders
      reference_values = Sequel.pg_array_op(:references[:name_values])
      stop_point_values = Sequel.pg_array_op(:stop_addresses[:addresses])

      @orders ||= company
        .bookings_dataset
        .where{ |r| r.bookings[:scheduled_at] =~ period }
        .join(:vehicles, id: :bookings[:vehicle_id])
        .join(:companies, id: :company_infos[:company_id])
        .left_join(:addresses.as(:company_addresses), id: :company_infos[:address_id])
        .left_join(:contacts, id: :company_infos[:contact_id])
        .left_join(:payment_options, company_id: :companies[:id])
        .left_join(:users.as(:salesmen), id: :company_infos[:salesman_id])
        .left_join(:travel_reasons, id: :bookings[:travel_reason_id])
        .left_join(:booking_addresses.as(:pickup_bas), booking_id: :bookings[:id], address_type: 'pickup')
        .left_join(:booking_addresses.as(:dest_bas), booking_id: :bookings[:id], address_type: 'destination')
        .left_join(:addresses.as(:pickup_addresses), id: :pickup_bas[:address_id])
        .left_join(:addresses.as(:destination_addresses), id: :dest_bas[:address_id])
        .left_join(booking_stop_points_dataset.as(:stop_addresses), booking_id: :bookings[:id])
        .left_join(:members.as(:passengers), id: :bookings[:passenger_id])
        .left_join(:users.as(:passenger_accounts), id: :passengers[:id])
        .left_join(:work_roles, id: :passengers[:work_role_id])
        .left_join(:departments, id: :passengers[:department_id])
        .left_join(:users.as(:booker_accounts), id: :bookings[:booker_id])
        .left_join(booking_references_dataset.as(:references), booking_id: :bookings[:id])
        .left_join(:booking_charges.as(:charges), booking_id: :bookings[:id])
        .select(
          Sequel.function(:coalesce, :bookings[:service_id], 'N/A').as(:booking_id),
          :companies[:id].as(:company_id),
          :company_infos[:name].as(:company_name),
          :company_addresses[:line].as(:company_address),
          :contacts[:email].as(:company_email),
          Sequel.join([:contacts[:first_name], ' ', :contacts[:last_name]]).as(:company_contact),
          Sequel.join([:salesmen[:first_name], ' ', :salesmen[:last_name]]).as(:account_manager),
          :payment_options[:payment_terms].as(:billing_terms),
          :bookings[:status].as(:booking_status),
          format_time(:bookings[:created_at], timezone: :pickup_addresses[:timezone]).as(:booking_created_at),
          format_time(:bookings[:arrived_at], timezone: :pickup_addresses[:timezone]).as(:booking_arrived_at),
          format_time(:bookings[:started_at], timezone: :pickup_addresses[:timezone]).as(:booking_started_at),
          format_time(:bookings[:ended_at], timezone: :pickup_addresses[:timezone]).as(:booking_ended_at),
          format_time(:bookings[:cancelled_at], timezone: :pickup_addresses[:timezone]).as(:booking_cancelled_at),
          :passenger_accounts[:email].as(:passenger_email),
          :passengers[:id].as(:passenger_id),
          :travel_reasons[:name].as(:reason_for_travel),
          :bookings[:payment_method].as(:payment_type),
          format_cents(:charges[:paid_waiting_time_fee]).as(:waiting_time_cost),
          format_cents(:company_infos[:run_in_fee] * 100).as(:run_in_fee),
          format_cents(:charges[:booking_fee]).as(:booking_fee),
          format_cents(:charges[:phone_booking_fee]).as(:phone_booking_fee),
          format_cents(:charges[:handling_fee]).as(:handling_fee),
          format_cents(:charges[:international_booking_fee]).as(:international_fee),
          format_cents(:charges[:vat]).as(:vat),
          format_cents(:charges[:extra1]).as(:extra_1),
          format_cents(:charges[:extra2]).as(:extra_2),
          format_cents(:charges[:extra3]).as(:extra_3),
          format_cents((:charges[:handling_fee] +
            :charges[:booking_fee] +
            :charges[:paid_waiting_time_fee] +
            :charges[:stops_fee] +
            :charges[:extra1] +
            :charges[:extra2] +
            :charges[:extra3] +
            :charges[:phone_booking_fee] +
            :charges[:cancellation_fee] +
            :charges[:tips])).as(:total_fees),
          format_cents(:charges[:total_cost] - :charges[:vat]).as(:final_cost_excl_vat),
          format_cents(:charges[:total_cost]).as(:final_cost_incl_vat),
          format_cents(:charges[:cancellation_fee]).as(:cancellation_cost),
          format_cents(:charges[:fare_cost]).as(:base_fare),
          seconds_to_minutes(:charges[:paid_waiting_time]).as(:waiting_time_minutes),
          {{:bookings[:passenger_id] => nil} => Sequel.join([:bookings[:passenger_first_name], ' ', :bookings[:passenger_last_name]])}
            .case(Sequel.join([:passenger_accounts[:first_name], ' ', :passenger_accounts[:last_name]])).as(:passenger_name),
          Sequel.join([:booker_accounts[:first_name], ' ', :booker_accounts[:last_name]]).as(:booker_name),
          :pickup_addresses[:line].sanitize_using(:pickup_bas[:passenger_address_type]).as(:pickup_address),
          :destination_addresses[:line].sanitize_using(:dest_bas[:passenger_address_type]).as(:destination_address),
          stop_point_values[1].as(:stop_point_1),
          stop_point_values[2].as(:stop_point_2),
          stop_point_values[3].as(:stop_point_3),
          stop_point_values[4].as(:stop_point_4),
          :vehicles[:name].as(:vehicle_type),
          reference_values[1].as(:reference_1),
          reference_values[2].as(:reference_2),
          reference_values[3].as(:reference_3),
          reference_values[4].as(:reference_4),
          format_time(:bookings[:scheduled_at], timezone: :pickup_addresses[:timezone]).as(:booking_scheduled_at),
          :departments[:name].as(:passenger_department),
          :work_roles[:name].as(:passenger_work_role),
          :passengers[:division].as(:passenger_division),
          :passengers[:cost_centre].as(:passenger_cost_centre),
          :passengers[:payroll].as(:passenger_payroll)
        )
    end
  end
end
