# Adapter for Credit Rating Experian API
#
# Example:
#
# client = ExperianApi::RegisteredCompanyCredit.new('99999999')
# client.execute
# client.sucess?
# client.normalized_response
#
module ExperianApi
  class Base < ApplicationService
    include ApplicationService::RestMethods

    class_attribute :token_data

    delegate :api_url, to: 'Settings.experian'

    def execute!(&block)
      authenticate! unless is_a?(Authenticate)

      result { make_request!(&block) }
      assert { response&.success? }
    end

    private def access_token
      token_data['access_token'] if token_data.present?
    end

    private def authenticate!
      @authenticate = ExperianApi::Authenticate.new.execute
    end

    class Response < ApplicationService::RestMethods::Response
      def success?
        super && data['error'].blank?
      end
    end
  end
end
