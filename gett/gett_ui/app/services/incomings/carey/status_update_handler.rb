module Incomings
  module Carey
    class StatusUpdateHandler < BaseHandler
      STATUS_MAPPING = {
        'Assigned'             => :order_received,
        'Pre-assigned'         => :order_received,
        'Acknowledged'         => :order_received,
        'Confirmed'            => :order_received,
        'Unassigned'           => :order_received,
        'En Route'             => :on_the_way,
        'On Location'          => :arrived,
        'On Board'             => :in_progress,
        'Completed'            => :completed,
        'Drop Off'             => :completed,
        'EOJ Submitted'        => :completed,
        'End-of-job submitted' => :completed, # this status not present in docs, but sended by carey in prod
        'In Billing'           => :completed,
        'Closed'               => :completed,
        'No Show'              => :cancelled,
        'Late Cancelled'       => :cancelled,
        'Canceled'             => :cancelled,
        'Nullified'            => :cancelled
      }.freeze
      private_constant :STATUS_MAPPING

      def execute!
        fail_safe(silence: true, fail_on_error: true) do
          transaction do
            result { update_model(booking, booking_params) }
            assert { Bookings::DriverUpdater.new(booking: booking, params: driver_params).execute.success? }
          end

          if success?
            create_model(incoming)
            Faye.bookings.notify_update(booking)
          else
            fail_with_exception!
          end
        end
      end

      def status
        STATUS_MAPPING[payload[:status]] || fail_with_exception!('status unrecognized')
      end

      private def booking_params
        {
          status: status,
          carey_token: payload[:token]
        }.tap do |params|
          if status != booking.status.to_sym && Bookings::TIMESTAMP_MAPPING[status].present?
            params[Bookings::TIMESTAMP_MAPPING[status]] = Time.current
          end
        end
      end

      private def driver_params
        driver         = payload.fetch(:chauffeur, {})
        vehicle        = payload.fetch(:vehicle, {})
        geocode_status = payload['geocode_status']

        params = {
          name: driver.values_at(:first_name, :last_name).join(' '),
          image_url: driver[:imageUrl],
          phone_number: driver.dig(:chauffeur_contact_details, 0, :contactValue),
          vehicle: {
            model: vehicle.values_at(:make, :model).join(' '),
            license_plate: vehicle[:license_num]
          }
        }

        return params if geocode_status.blank?

        params.merge!(
          lat: geocode_status['latitude'],
          lng: geocode_status['longitude']
        )
      end
    end
  end
end
