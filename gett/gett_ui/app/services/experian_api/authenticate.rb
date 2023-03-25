module ExperianApi
  class Authenticate < Base
    include ApplicationService::MutexModule

    http_method :post

    delegate :username, :password, :client_id, :client_secret, to: 'Settings.experian.oauth'

    # FYI: https://developer.experian.co.uk/tutorial/oauth-20-tutorial
    def execute!
      # sync to prevent several simultaneous authentication requests
      sync do
        return @result = 'authenticated' unless token_expired?

        super

        if success?
          ExperianApi::Base.token_data = response.data
        else
          fail 'Authentication was failed'
        end
      end
    end

    def post(url, params, &block)
      super(url, params, request_headers, &block)
    end

    private def url
      URI.join(api_url, '/oauth2/v1/token').to_s
    end

    private def params
      {
        username: username,
        password: password
      }
    end

    private def request_headers
      {
        content_type: 'application/json',
        # Strings are important. RestClient changes Symbol-headers
        'Client_id' => client_id,
        'Client_secret' => client_secret
      }
    end

    private def token_expired?
      return true if token_data.blank?

      Time.current.to_i > token_data['issued_at'].to_i + token_data['expires_in'].to_i
    end
  end
end
