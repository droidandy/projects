module GetE
  class Base < ApplicationService
    include ApplicationService::RestMethods
    include ApplicationService::Context

    delegate :api_url, :api_key, to: 'Settings.get_e', allow_nil: true

    def execute!(&block)
      result { make_request!(&block) }
      assert { response&.success? }
    end

    def get(url, params, &block)
      request_headers = default_headers.merge!(params: params)
      super(url, request_headers, &block)
    end

    def post(url, params, &block)
      super(url, params, default_headers, &block)
    end

    def patch(url, params, &block)
      super(url, params, default_headers, &block)
    end

    def delete(url, headers = {}, &block)
      super(url, default_headers.merge!(headers), &block)
    end

    private def url(endpoint)
      endpoint.prepend('/') unless endpoint.start_with?('/')
      api_url + endpoint
    end

    private def request_type
      super(:raw)
    end

    private def params
      {}
    end

    private def default_headers
      api_key.present? ? { authorization: "X-Api-Key #{api_key}" } : {}
    end
  end
end
