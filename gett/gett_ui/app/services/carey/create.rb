module Carey
  class Create < Base
    include ApplicationService::CurrencyHelpers

    DEFAULT_COUNTRY_ACCESS_CODE = '1'.freeze

    attributes :booking

    delegate :vehicle, to: :booking, allow_nil: true
    delegate :passenger_info, to: :booking

    normalize_response do
      map from('/reservation/confirmation/@id'), to('/service_id')
      map from('/reservation/total_charge/@rate_total_amount'), to('/fare_quote') do |price|
        Currencies::Converter.new(
          amount: price.to_f,
          from: 'USD',
          to: 'GBP'
        ).execute.result * 100
      end
    end

    def soap_method
      :add_reservation
    end

    def options
      {
        POS: pos_structure,
        GroundReservation: {
          Location: stops_structure,
          Passenger: passenger_structure,
          Service: {
            ServiceLevel: service_level_structure,
            VehicleType: {
              :@Code => booking.quote_id
            }
          },
          RateQualifier: rate_qualifier
        }
      }
    end

    private def header_attributes
      { SequenceNmbr: sequence_number }
    end

    private def stops
      [
        booking.pickup_address,
        * booking.stop_addresses,
        booking.destination_address
      ]
    end

    private def scheduled_at
      booking.scheduled_at.in_time_zone(booking.timezone).to_datetime
    end

    private def passenger_structure
      {
        Primary: {
          PersonName: {
            GivenName: passenger_info[:first_name],
            Surname: passenger_info[:last_name] || passenger_info[:first_name]
          },
          Telephone: {
            :@PhoneNumber => phone_number,
            :@PhoneUseType => "1", # 1 - mobile, 2 - other
            :@CountryAccessCode => country_access_code
          },
          Email: passenger_email
        }
      }
    end

    private def service_level_structure
      {
        :@Code => booking.as_directed? ? SERVICE_AS_DIRECTED : SERVICE_POINT_TO_POINT,
        :@Description => SERVICE_DESCRIPTION
      }
    end

    private def airport_structure(address)
      super.tap do |structure|
        structure[:Airline] = airline_structure(address)
      end
    end

    private def airport_data(address)
      super.tap do |structure|
        structure[:@Terminal] = flight_info[address.airport.iata][:terminal]
      end
    end

    private def airline_structure(address)
      info = flight_info[address.airport.iata]

      {
        :@FlightDateTime => info[:time],
        :@FlightNumber => info[:flight],
        :@Code => info[:carrier]
      }
    end

    private def pickup_address?(address)
      address[:id] == booking.pickup_address.id
    end

    private def destination_address?(address)
      return false if booking.destination_address.blank?

      address[:id] == booking.destination_address.id
    end

    private def flight_info
      @flight_info ||= Bookings::FlightInfo.new(
        flight: booking.flight,
        scheduled_at: scheduled_at,
        pickup_iata: stops[0...-1].map{ |addr| addr&.airport&.iata }.compact,
        destination_iata: booking.destination_address&.airport&.iata
      ).execute.result
    end

    private def phone_number
      parsed_phone_number&.format("%a%n") || original_phone_number # rubocop:disable Style/FormatStringToken
    end

    private def parsed_phone_number
      @parsed_phone_number ||= Phoner::Phone.parse(passenger_info[:phone_number])
    rescue Phoner::CountryCodeError
      nil
    end

    private def original_phone_number
      @original_phone_number ||= passenger_info[:phone_number].gsub(/\D/, '')
    end

    private def country_access_code
      parsed_phone_number&.country_code || DEFAULT_COUNTRY_ACCESS_CODE
    end

    private def passenger_email
      passenger_info[:email].presence || "#{original_phone_number}@gett.com"
    end

    private def rate_qualifier
      super.merge(
        SpecialInputs: {
          :@Name  => 'OT Order ID',
          :@Value => booking.id
        }
      )
    end
  end
end
