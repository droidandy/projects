require 'sequel/extensions/core_refinements'
using Sequel::CoreRefinements

namespace :bookings do
  desc "Fill completed bookings with charges info"
  task fill_charges: :environment do
    completed_bookings = Booking.completed.where{ created_at >= Date.new(2017, 8, 1) }

    completed_bookings.gett.each do |booking|
      Bookings::ChargesUpdaters::Gett.new(booking: booking).execute
    end
    puts 'Completed filling Gett bookings'

    completed_bookings.ot.each do |booking|
      Bookings::ChargesUpdaters::OT.new(booking: booking).execute
    end
    puts 'Completed filling OneTransport bookings'
  end

  desc 'Update charges for bookings since November 2018'
  task update_charges: :environment do
    booking_ids = Booking
      .final
      .where{ created_at >= Date.new(2018, 11, 1) }
      .where(billed: false)
      .order(:id)
      .select_map(:id)

    booking_ids.each_slice(1000) do |paged_ids|
      bookings = Booking.where(id: paged_ids).eager(:charges, :vehicle, :pickup_address).all

      bookings.each do |booking|
        next if booking.charges.nil?

        print "#{booking.id} "

        begin
          Bookings::SetCharges.new(booking: booking, params: {}).execute
        rescue StandardError => e
          puts e.message
        end
      end
    end
  end

  desc 'Refreshes indexes stored in booking_indexes table'
  task refresh_indexes: :environment do
    DB.transaction do
      DB[:booking_indexes].truncate

      DB[:booking_indexes]
        .insert(
          [
            :booking_id,
            :service_id,
            :supplier_service_id,
            :local_scheduled_at,
            :order_id,
            :vendor_name,
            :company_id,
            :passenger_id,
            :passenger_full_name
          ],
          DB[:bookings]
            .join(:vehicles, id: :bookings[:vehicle_id])
            .left_join(:booking_drivers, booking_id: :bookings[:id])
            .left_join(:booking_addresses, booking_id: :bookings[:id], address_type: 'pickup')
            .left_join(:addresses, id: :booking_addresses[:address_id])
            .left_join(:users, id: :bookings[:passenger_id])
            .left_join(:company_infos, id: :bookings[:company_info_id])
            .select(
              :bookings[:id],
              :bookings[:service_id],
              :bookings[:supplier_service_id],
              :coalesce.sql_function(
                :bookings[:scheduled_at].at_time_zone('UTC').at_time_zone(:addresses[:timezone]),
                :bookings[:scheduled_at]
              ),
              :lower.sql_function(
                Sequel.case(
                  {{:vehicles[:service_type] => 'splyt'} => Sequel.join(['sp', :bookings[:id]])},
                  :bookings[:service_id]
                )
              ),
              Sequel.case(
                {
                  {:vehicles[:service_type] => 'ot'} => :booking_drivers[:vendor_name],
                  {:vehicles[:service_type] => 'get_e'} => 'GetE',
                  {:vehicles[:service_type] => 'gett', :addresses[:country_code] => 'RU'} => 'Gett RU',
                  {:vehicles[:service_type] => 'gett', :addresses[:country_code] => 'IL'} => 'Gett IL',
                  {:vehicles[:service_type] => 'gett'} => 'Gett UK'
                },
                nil
              ),
              :company_infos[:company_id],
              :bookings[:passenger_id],
              :lower.sql_function(
                Sequel.case(
                  {~{passenger_id: nil} => :concat_ws.sql_function(' ', :users[:first_name], :users[:last_name])},
                  :concat_ws.sql_function(' ', :bookings[:passenger_first_name], :bookings[:passenger_last_name])
                )
              )
            )
        )
    end
  end
end
