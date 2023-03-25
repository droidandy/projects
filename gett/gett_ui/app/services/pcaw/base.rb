module Pcaw
  class Base < ApplicationService
    include ApplicationService::RestMethods
    include ApplicationService::NormalizedResponse

    KEY = 'JZ99-YZ77-JD65-WK14'.freeze
    BASE_URL =
      if Rails.env.development?
        'http://35.176.187.186/pcaw'.freeze
      else
        'https://services.postcodeanywhere.co.uk'.freeze
      end

    private_constant :BASE_URL, :KEY

    def http_method
      :get
    end

    def execute!
      get(url, params)
      result { normalized_response }
    end

    private def get(url, params)
      request_headers = { params: params, content_type: 'application/json' }
      super(url, request_headers)
    end

    private def url(endpoint)
      BASE_URL + endpoint
    end

    private def params
      { Key: KEY }
    end
  end
end
