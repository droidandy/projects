namespace :db do
  desc "creates DB if it doesn't exist and adds necessary extensions necessary to run the app"
  task prepare: :environment do
    unless (DB.test_connection rescue false) # rubocop:disable Style/RescueModifier
      Rake::Task['db:create'].invoke
    end

    Sequel::Model.db.run 'CREATE EXTENSION IF NOT EXISTS hstore'
  end

  namespace :views do
    desc "Creates :orders view"
    task create_orders: :environment do
      using Sequel::CoreRefinements

      references_dataset = DB.from(:booker_references)
        .select{ [booking_id, hstore(array_agg(booking_reference_name), array_agg(value)).as(:values)] }
        .group(:booking_id)

      null_int = "NULL::int".lit
      null_txt = "NULL::text".lit

      DB.create_or_replace_view(:orders,
        DB.from(:bookings)
          .join(:company_infos, id: :company_info_id)
          .left_join(:users.as(:salesmen), id: :company_infos[:salesman_id])
          .left_join(:addresses.as(:company_addresses), id: :company_infos[:address_id])
          .left_join(:contacts, id: :company_infos[:contact_id])
          .left_join(references_dataset.as(:references), booking_id: :bookings[:id])
          .left_join(:booking_addresses.as(:pickup_bas), booking_id: :bookings[:id], address_type: 'pickup')
          .left_join(:booking_addresses.as(:dest_bas), booking_id: :bookings[:id], address_type: 'destination')
          .left_join(:addresses.as(:pickup_addresses), id: :pickup_bas[:address_id])
          .left_join(:addresses.as(:destination_addresses), id: :dest_bas[:address_id])
          .left_join(:members.as(:passengers), id: :bookings[:passenger_id])
          .left_join(:members.as(:bookers), id: :bookings[:booker_id])
          .left_join(:users.as(:passenger_accounts), id: :passengers[:id])
          .left_join(:users.as(:booker_accounts), id: :bookers[:id])
          .left_join(:departments, id: :passengers[:department_id])
          .left_join(:payments, booking_id: :bookings[:id])
          .left_join(:booking_charges, booking_id: :bookings[:id])
          .select(
            null_int.as(:cost_settled),
            null_int.as(:cost_to_be_paid),
            null_int.as(:total_fees),
            null_int.as(:total_fare),
            :booking_charges[:fare_cost].as(:final_cost_excl_vat),
            :booking_charges[:total_cost].as(:final_cost_incl_vat),
            :company_infos[:company_id].as(:company_id),
            :company_infos[:name].as(:company_name),
            :company_addresses[:line].as(:company_address),
            :contacts[:email].as(:company_email),
            Sequel.join([:contacts[:first_name], ' ', :contacts[:last_name]]).as(:company_contact_person),
            Sequel.join([:salesmen[:first_name], ' ', :salesmen[:last_name]]).as(:company_account_manager),
            null_int.as(:company_charge_fees_on_credit_card),
            null_int.as(:company_charge_fees_from_client),
            null_txt.as(:company_business_type),
            :bookings[:id].as(:order_id),
            null_txt.as(:order_class),
            :bookings[:status].as(:order_status),

            :bookings[:created_at].as(:order_created_at),
            :bookings[:scheduled_at].as(:order_scheduled_at),
            :bookings[:arrived_at].as(:order_arrived_at),
            :bookings[:started_at].as(:order_started_at),
            :bookings[:ended_at].as(:order_ended_at),
            :bookings[:cancelled_at].as(:order_cancelled_at),
            :pickup_addresses[:line].as(:order_origin_address),
            :destination_addresses[:line].as(:order_destination_address),
            null_txt.as(:order_dropoff_address),  # TODO: further integration with APIs
            null_int.as(:order_driving_distance), # TODO: further integration with APIs
            :references[:values].as(:order_references),
            null_txt.as(:order_reason_for_travel),
            null_int.as(:order_fixed_price),  # TODO: further integration with APIs
            null_int.as(:order_taxi_meter),   # TODO: further integration with APIs
            null_int.as(:order_waiting_time), # TODO: further integration with APIs
            null_int.as(:order_waiting_time_cost),
            null_int.as(:order_additional_cost),
            null_int.as(:order_extras_cost),
            "5".lit.as(:order_cancellation_cost),
            null_int.as(:order_stop_point_cost),
            null_int.as(:order_gratuity_cost),
            null_int.as(:order_vat_fee),
            null_int.as(:order_has_credit_card_debt),
            null_int.as(:order_credit_card_type),
            null_int.as(:order_credit_card_ending),
            :company_infos[:run_in_fee].as(:order_run_in_fee),
            :company_infos[:booking_fee].as(:order_booking_fee),
            :company_infos[:handling_fee].as(:order_handling_fee),
            {{:bookings[:passenger_id] => nil} => Sequel.join([:bookings[:passenger_first_name], ' ', :bookings[:passenger_last_name]])}
              .case(Sequel.join([:passenger_accounts[:first_name], ' ', :passenger_accounts[:last_name]])).as(:riding_user_name),
            :passenger_accounts[:email].as(:riding_user_email),
            :passengers[:id].as(:riding_user_employee_id),
            :departments[:name].as(:riding_user_department),
            Sequel.join([:booker_accounts[:first_name], ' ', :booker_accounts[:last_name]]).as(:ordering_user_name),

            :payments[:status].as(:order_payment_status),
            :payments[:error_description].as(:order_payment_errors),
            :bookings[:payment_method].as(:order_payment_type)
          )
      )
    end

    desc "Creates :vehicle_products view"
    task create_vehicle_products: :environment do
      DB.create_or_replace_view(:vehicle_products,
        DB[:vehicles]
          .where(active: true)
          .select{ [:name, :service_type, :pre_eta, :earliest_available_in, array_agg(:value).as(:values), array_agg(:id).as(:vehicle_ids)] }
          .group(:name, :service_type, :pre_eta, :earliest_available_in)
      )
    end

    task create_all: [:create_orders, :create_vehicle_products] do
      Rake::Task['db:dump'].reenable
      Rake::Task['db:dump'].invoke if SequelRails.configuration.schema_dump
    end
  end
end

Rake::Task['db:migrate'].enhance do
  Rake::Task['db:views:create_all'].invoke
end
