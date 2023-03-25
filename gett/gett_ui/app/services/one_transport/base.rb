module OneTransport
  class Base < ApplicationService
    include ApplicationService::SoapMethods
    include ApplicationService::NormalizedResponse
    include ApplicationService::Context

    PASSENGER_TYPE_GUEST = 'Guest'.freeze
    PASSENGER_TYPE_STAFF = 'Staff'.freeze
    PASSENGER_TYPE_FREELANCER = 'Freelancer'.freeze

    ACTION_SETDOWN = 'Setdown'.freeze
    ACTION_PICKUP = 'Pickup'.freeze

    delegate :wsdl_key, :wsdl_url, :client_name, :client_number, :username, :password, to: 'Settings.ot'

    attributes :company # may be as well provided by context

    private def company
      attributes[:company] || context.company
    end

    private def request
      {
        message: {
          request: {header: request_headers}.merge(options)
        }
      }
    end

    private def options
      {}
    end

    private def request_headers
      {
        version:       4,
        key:           wsdl_key,
        username:      username,
        client_number: client_number,
        password:      password,
        max_reply:     1
      }.merge(header_options)
    end

    private def header_options
      {}
    end

    private def booker
      return @booker if defined?(@booker)

      service = OneTransport::ProfileLookup.new
      if service.execute.success?
        @booker = service.normalized_response
      else
        fail 'Fetching booker info failed'
      end
    rescue StandardError
      fail 'Fetching booker info failed'
    end

    private def stop_structure(passenger, stops, scheduled_at)
      stops.map.with_index do |stop, index|
        {
          stop_ID: index,
          address_details: {
            address: {
              building_name: '',
              business_name: '',
              apartment:     '',
              street_number: '',
              street_name:   stop[:line],
              dst:           '',
              town:          '',
              country:       stop[:country_code],
              postcode:      stop[:postal_code]
            },
            location: {
              latitude:  stop[:lat],
              longitude: stop[:lng]
            }
          },
          passengers: {
            passenger_structure: {
              person: {
                passenger_type: {
                  name: passenger[:passenger_type],
                  type: PASSENGER_TYPE_GUEST # type should be GUEST always
                },
                title:                '',
                first_name:           stop[:first_name] || passenger[:first_name],
                last_name:            stop[:last_name] || passenger[:last_name],
                mobile_phone:         sanitize_phone_number(stop[:phone_number] || passenger[:phone_number]),
                home_phone:           sanitize_phone_number(stop[:phone_number] || passenger[:phone_number]),
                work_phone:           sanitize_phone_number(stop[:phone_number] || passenger[:phone_number]),
                email:                '',
                notification:         '',
                client_number:        '',
                staff_number:         '',
                role:                 '',
                special_requirements: '',
                flags:                ''
              },
              action: (stops.size == index + 1) ? ACTION_SETDOWN : ACTION_PICKUP
            }
          },
          stop_notes: index == 0 && passenger[:message] || '',
          required_date_time: scheduled_at,
          as_directed:        false
        }
      end
    end

    private def sanitize_phone_number(phone_number)
      phone_number.sub(/\s+x.+$/, '').gsub(/[^\d]/, '')
    end

    private def wait_and_return?
      return false if stops.size < 3 # no stop points - pickup and dropoff only

      stops.first[:line] == stops.last[:line]
    end
  end

  class Response
    attr_reader :soap_response, :soap_method

    def initialize(response, soap_method:)
      @soap_method = soap_method
      @soap_response = response
    end

    def data
      @data ||= soap_response.body[:"#{soap_method}_response"][:"#{soap_method}_result"]
    end

    def success?
      data.dig(:header, :result, :code) == '0'
    end

    def error
      data.dig(:header, :result, :message)
    end
  end
end
