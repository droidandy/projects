module PaymentsOS
  class Base < ApplicationService
    include ApplicationService::RestMethods

    def self.api_version(version)
      define_method(:api_version) { version }
    end

    api_version '1.0.0'

    delegate :api_url, :app_id, :private_key, :public_key, :payments_os_env, to: 'Settings.payments_os'
    delegate :data, :headers, to: :response

    private def default_headers
      {
        'Content-Type' => 'application/json',
        'X-Payments-Os-Env' => payments_os_env,
        'App_id' => app_id,
        'Private_key' => private_key,
        'Api-Version' => api_version,
        'public_key' => public_key
      }
    end

    def execute!(&block)
      result { make_request!(&block) }
      assert { response.success? }
    end

    private def params
      {}
    end

    private def url(endpoint)
      endpoint = '/' + endpoint unless endpoint[0] == '/'
      api_url + endpoint
    end
  end
end
