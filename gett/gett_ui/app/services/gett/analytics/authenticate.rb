module Gett
  module Analytics
    class Authenticate < ::Gett::Authenticate
      delegate :api_url, :client_id, :client_secret, to: 'Settings.gt.analytics.auth'

      private def params
        {
          grant_type:    :client_credentials,
          client_id:     client_id,
          client_secret: client_secret,
          scope:         :relay
        }
      end
    end
  end
end
