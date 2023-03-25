module Carey
  class Base < ApplicationService
    include ApplicationService::SoapMethods
    include ApplicationService::NormalizedResponse

    SERVICE_AS_DIRECTED    = 'AsDirected'.freeze
    SERVICE_POINT_TO_POINT = 'Point-To-Point'.freeze
    SERVICE_DESCRIPTION    = 'Premium'.freeze

    delegate :wsdl_url, :requestor_id, :requestor_password, :account_id,
      :company_name, :company_short_name, :company_context, :app_id, :app_key,
      to: 'Settings.carey'

    private def request
      { message: options }.tap do |hash|
        hash[:attributes] = header_attributes if header_attributes.any?
      end
    end

    private def client_headers
      {
        app_id: app_id,
        app_key: app_key,
        'X-SOAP-Method': soap_method.to_s.camelize(:lower)
      }
    end

    private def options
      {}
    end

    private def header_attributes
      {}
    end

    private def pos_structure
      {
        Source: {
          RequestorID: {
            :@MessagePassword => requestor_password,
            :@ID => requestor_id,
            :@Type => "TA"
          },
          BookingChannel: {
            content!: {
              CompanyName: {
                content!: company_name,
                :@Code => app_key,
                :@CompanyShortName => company_short_name,
                :@CodeContext => company_context
              }
            },
            :@Type => "TA"
          }
        }
      }
    end

    private def rate_qualifier
      { :@AccountID => account_id }
    end

    private def stops_structure
      pickup, *additional_stops, destination = stops
      structure = { Pickup: stop_structure(pickup, scheduled_at) }
      if additional_stops.any?
        structure[:Stops] = { Stop: additional_stops.map{ |stop| stop_structure(stop) } }
      end
      structure[:Dropoff] = stop_structure(destination) if destination.present?
      structure
    end

    private def stop_structure(address, datetime = nil)
      structure = address&.airport.present? ? airport_structure(address) : address_structure(address)
      structure[:@DateTime] = datetime.strftime('%Y-%m-%dT%H:%M:%S') if datetime.present?
      structure
    end

    private def address_structure(address)
      {
        content!: {
          Address: {
            content!: {
              # Carey has 30 symbols limit of the AddressLine
              AddressLine: address[:line].slice(0, 30),
              CityName:    address[:city],
              PostalCode:  address[:postal_code],
              CountryName: {
                :@Code => address[:country_code]
              }
            },
            :@Latitude =>  address[:lat].to_s,
            :@Longitude => address[:lng].to_s
          }
        }
      }
    end

    private def airport_structure(address)
      airport_info = {}
      airport_info[:Arrival]   = airport_data(address) if address != stops.last # pickup and stops
      airport_info[:Departure] = airport_data(address) if address == stops.last # destination

      { AirportInfo: airport_info }
    end

    private def airport_data(address)
      {
        :@AirportName => address.airport.name,
        :@LocationCode => address.airport.iata
      }
    end

    # According to API docs,
    # SequenceNmbr (string[100], required): A unique number generated for every request a Partner makes to Carey.
    # This number is used to prevent duplicate requests
    private def sequence_number
      Time.now.strftime('%s%6N') + format('%04d', SecureRandom.random_number(10**4))
    end

    # used in Modify and Cancel services
    private def last_version
      if find_reservation_service.execute.success?
        find_reservation_service.normalized_response[:version]
      else
        fail Bookings::ServiceProviderError, "Cannot find reservation with id #{reservation_id} via Carey API"
      end
    end

    private def find_reservation_service
      @find_reservation_service ||= Carey::FindReservation.new(reservation_id: booking.service_id)
    end
  end
end
