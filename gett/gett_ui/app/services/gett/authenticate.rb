module Gett
  class Authenticate < Base
    include ApplicationService::MutexModule

    http_method :post

    class << self
      attr_accessor :token_data
    end

    def execute!
      # sync to prevent several simultaneous authentication requests
      sync do
        return @result = 'authenticated' unless token_expired?

        super

        if success?
          self.class.token_data = response.data
        else
          fail "Gett Authentication was failed"
        end
      end
    end

    private def token_data
      self.class.token_data
    end

    private def url
      super("/oauth/token?#{params.to_param}")
    end

    private def params
      {
        grant_type:    :client_credentials,
        client_id:     client_id,
        client_secret: client_secret,
        scope:         :business
      }
    end

    private def token_expired?
      return true if token_data.blank?

      Time.current.to_i > token_data['created_at'] + token_data['expires_in']
    end
  end
end
