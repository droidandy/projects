module OneTransport
  class Create < Base
    attributes :booking

    delegate :company_info, :company, to: :booking

    normalize_response do
      map from('/job/general/ot_confirmation_number'), to('/ot_confirmation_number')
      map from('/job/general/external_reference'), to('/service_id')
      map from('/costs/charges/charge_structure'), to('/fare_quote') do |charge_structure|
        charge_structure.find{ |charge| charge[:charge_name] == 'FARE_QUOTE' }[:amount].to_i.round
      end
    end

    private def soap_method
      :job_booking
    end

    def options
      vehicle_type, vehicle_class = booking.vehicle.value.split('_')

      {
        job: {
          general: {
            OT_confirmation_number: booking.ot_confirmation_number,
            state: 'None',
            client: {
              client_number: company.ot_client_number,
              client_name:   ''
            },
            external_reference: booking.service_id || booking.id,
            quote_ID:        '', # this has to be blank to make OT API work
            activation_code: '',
            payment_reference: {
              payment_method: {
                payment_name: '',
                payment_ID:   'Account',
                payment_type: 'Client',
                client: {
                  client_number: company.ot_client_number,
                  client_name:   ''
                }
              },
              amount: 0.0,
              notes: ''
            },
            booker: booker,
            job_flags: {
              job_requirements: special_requirements,
              wait_and_return:  wait_and_return,
              vehicle_type:     vehicle_type,
              vehicle_class:    vehicle_class,
              journey_reason:   'Work to Home',
              num_passengers:   1,
              origin:           'Web',
              job_charge_type:  'None',
              asap:             false,
              share:            false
            }.tap{ |flags| flags[:preferred_vendor_ID] = booking.vehicle_vendor_key if booking.vehicle_vendor_key.present? },
            date: booking.scheduled_at.to_datetime
          },
          stops: { stop_structure: stop_structure(passenger, stops, booking.scheduled_at.to_datetime) }
        }
      }
    end

    private def passenger
      booking.passenger_info.slice(:first_name, :last_name, :phone_number).tap do |info|
        info[:phone_number] = sanitize_phone_number(info[:phone_number])
        info[:message] = booking.message_to_driver
        info[:passenger_type] = passenger_type
      end
    end

    private def passenger_type
      return PASSENGER_TYPE_GUEST unless company.bbc?

      return PASSENGER_TYPE_FREELANCER if booking.passenger&.bbc_freelancer?
      return PASSENGER_TYPE_STAFF      if booking.passenger&.bbc_staff?

      PASSENGER_TYPE_GUEST
    end

    private def wait_and_return
      wait_and_return? ? 1 : 0
    end

    private def stops
      [
        address_hash(booking.pickup_address),
        * booking.stop_addresses.map { |address| stop_address_hash(address) },
        address_hash(booking.destination_address)
      ]
    end

    private def address_hash(address)
      address.as_json(only: [:postal_code, :lat, :lng, :line, :country_code]).with_indifferent_access
    end

    private def stop_address_hash(address)
      address_hash(address).tap do |json|
        json[:first_name], json[:last_name] = address[:stop_info]['name']
        json[:last_name] ||= ''
        json[:phone_number] = sanitize_phone_number(address[:stop_info]['phone'])
      end
    end

    private def special_requirements
      return [] if booking.special_requirements.blank?

      booking.special_requirements.map do |sr|
        {
          requirements_structure: {
            OT_requirement_ID: sr,
            description: special_requirement_label_for(sr)
          }
        }
      end
    end

    private def special_requirement_label_for(requirement_key)
      requirement =
        company.special_requirements_for(Bookings::Providers::OT).find do |r|
          r[:key] == requirement_key
        end

      requirement&.fetch(:label, '')
    end
  end
end
