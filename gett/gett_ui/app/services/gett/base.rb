module Gett
  class Base < ApplicationService
    include ApplicationService::RestMethods
    include ApplicationService::Context

    delegate :api_url, :client_id, :client_secret, :il_business_id, :ru_business_id, to: 'Settings.gt'

    attributes :company # may be as well provided by context

    def self.fetch_business_id_from(&block)
      redefine_method(:business_id_country_code, &block)
    end

    def execute!(&block)
      authenticate! unless is_a?(Authenticate)

      result { make_request!(&block) }
      assert { response&.success? }
    end

    private def company
      attributes[:company] || context.company
    end

    private def default_headers
      {content_type: 'application/json'}
    end

    def get(url, params, &block)
      request_headers = { params: params }
      request_headers.merge!(authorization: "Bearer #{access_token}") if access_token.present?
      super(url, request_headers, &block)
    end

    def post(url, params, &block)
      request_headers = access_token.present? ? { authorization: "Bearer #{access_token}" } : {}
      super(url, params, request_headers, &block)
    end

    def patch(url, params, &block)
      request_headers = access_token.present? ? { authorization: "Bearer #{access_token}" } : {}
      super(url, params, request_headers, &block)
    end

    private def authenticate!
      @auth = Gett::Authenticate.new.execute
    end

    private def url(endpoint)
      endpoint = '/' + endpoint unless endpoint[0] == '/'
      api_url + endpoint
    end

    private def params
      {}
    end

    private def access_token
      Gett::Authenticate.token_data['access_token'] if Gett::Authenticate.token_data.present?
    end

    private def business_id
      case business_id_country_code
      when 'IL'
        il_business_id
      when 'RU'
        ru_business_id
      else
        company.gett_business_id
      end
    end

    private def business_id_country_code
      # majority of Gett services have `:booking` attribute that define business_id to be used
      # when service sends request to Gett API. ones that do not have `:booking` attribute
      # have to specify country_code to be used via `fetch_business_id_from` class method
      booking.pickup_address.country_code if attributes_list.include?(:booking)
    end

    class Response < ApplicationService::RestMethods::Response
      def success?
        super && data['error'].blank?
      end
    end
  end
end
