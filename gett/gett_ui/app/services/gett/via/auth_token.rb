module Gett::Via
  class AuthToken < ApplicationService
    include ApplicationService::RestMethods
    include ApplicationService::NormalizedResponse

    REDIS_AUTH_KEY = :gett_via_api_oauth2_access_token
    private_constant :REDIS_AUTH_KEY

    normalize_response do
      map from('/access_token'), to('/access_token')
      map from('/expires_in'), to('/expires_in')
    end

    private def execute!
      fetch_access_token
    end

    private def url
      # unable to pass args in params of request
      "#{Settings.via.oauth2_host}/oauth2/token?grant_type=client_credentials"
    end

    private def default_headers
      {
        content_type: 'application/x-www-form-urlencoded',
        authorization: "Basic #{secret}"
      }
    end

    private def secret
      Base64.strict_encode64("#{Settings.via.client_id}:#{Settings.via.client_secret}")
    end

    private def redis
      ::Redis.current
    end

    private def expires_in
      expires_in = normalized_response&.dig(:expires_in)
      # decrease initial expires time to prevent usage of an outdated token
      expires_in && expires_in.to_i - 5
    end

    private def access_token
      @access_token ||= redis.get(REDIS_AUTH_KEY)
    end

    private def store_access_token!(value, expires_in)
      if expires_in.present?
        redis.multi do
          redis.set(REDIS_AUTH_KEY, value)
          redis.expire(REDIS_AUTH_KEY, expires_in)
        end
      end
    end

    private def fetch_access_token
      return access_token if access_token.present?

      post(url, nil, default_headers)

      normalized_response&.dig(:access_token).tap do |token|
        store_access_token!(token, expires_in) if token.present?
      end
    end
  end
end
