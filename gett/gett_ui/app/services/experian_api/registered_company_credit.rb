# FYI: https://developer.experian.co.uk/commercial-credit/apis/get/v1/registeredcompanycredit/%7BRegNumber%7D
module ExperianApi
  class RegisteredCompanyCredit < Base
    http_method :get

    attributes :company_reg_number # String

    def get(url, _params, &block)
      super(url, request_headers, &block)
    end

    def normalized_response
      # TODO: fix later. sandbox-api returns invalid values
      if Rails.env.test?
        return {
          incorporated_at: response.data.dig('Identification', 'IncorporationDate'),
          credit_rating_status: response.data.dig('Identification', 'LegalStatus'),
          credit_rating_value: response.data.dig('CommercialDelphi', 'CreditRating'),
          successful_execution: success?
        }
      end

      random_status = ['Bad Credit', 'Bankruptcy', 'Liquidation', 'CCJ'].sample
      @normalized_response ||= {
        incorporated_at: Date.new(2010, 1, 1),
        credit_rating_status: convert_credit_rating_status(random_status),
        credit_rating_value: Random.rand(1000),
        successful_execution: [true, false].sample
      }
    end

    private def request_headers
      {
        accept: 'application/json',
        authorization: "Bearer #{access_token}"
      }
    end

    private def params
      {}
    end

    private def url
      URI.join(api_url, '/risk/business/v1/registeredcompanycredit/', company_reg_number).to_s
    end

    private def convert_credit_rating_status(status)
      case status
      when 'Bad Credit'  then Company::CreditRateStatus::BAD_CREDIT
      when 'Bankruptcy'  then Company::CreditRateStatus::BANKRUPTCY
      when 'Liquidation' then Company::CreditRateStatus::LIQUIDATION
      when 'CCJ'         then Company::CreditRateStatus::CCJ
      else status
      end
    end
  end
end
