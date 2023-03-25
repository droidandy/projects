module Splyt
  class Base < ApplicationService
    include ApplicationService::RestMethods
    include ApplicationService::Context
    include ApplicationService::NormalizedResponse

    delegate :api_url, :api_key, to: 'Settings.splyt'

    private def execute!(&block)
      result { make_request!(&block) }
      assert { response&.success? }
    end

    def get(url, params, &block)
      super(url, request_headers.merge(params: params), &block)
    end

    def post(url, params, &block)
      super(url, params, request_headers, &block)
    end

    def patch(url, params, &block)
      super(url, params, request_headers, &block)
    end

    private def url(endpoint)
      api_url + endpoint
    end

    private def params
      {}
    end

    private def request_headers
      {}
    end

    private def default_headers
      { authorization: "Bearer #{api_key}" }
    end
  end
end
