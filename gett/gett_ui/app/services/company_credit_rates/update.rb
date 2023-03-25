module CompanyCreditRates
  class Update < ApplicationService
    include ApplicationService::ModelMethods

    BAD_CREDIT_VALUE = 561

    attributes :company, :params

    def execute!
      transaction do
        company.credit_rate&.inactivate!
        CompanyCreditRate.create(
          company: company,
          value: credit_rate_value
        )

        company.update(
          credit_rate_incorporated_at: params[:incorporated_at],
          credit_rate_status: credit_rate_status
        )

        success!
      end

      send_notifications
    end

    private def send_notifications
      if credit_rate_status == Company::CreditRateStatus::BAD_CREDIT
        CompanyCreditRateMailer.bad_credit_alert(company)
      elsif credit_rate_status.in?(Company::CreditRateStatus::LIQUIDATION_STATUSES)
        CompanyCreditRateMailer.liquidation_alert(company)
      end
    end

    private def credit_rate_status
      @credit_rate_status ||= calculate_credit_rate_status
    end

    private def calculate_credit_rate_status
      return Company::CreditRateStatus::UNABLE_TO_CHECK unless params[:successful_execution]

      if params[:credit_rating_status].in?(Company::CreditRateStatus::LIQUIDATION_STATUSES)
        return params[:credit_rating_status]
      end

      return Company::CreditRateStatus::BAD_CREDIT if credit_rate_value < BAD_CREDIT_VALUE

      Company::CreditRateStatus::OK
    end

    private def credit_rate_value
      @credit_rate_value ||= params[:credit_rating_value]
    end
  end
end
