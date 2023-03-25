class CreditRateUpdater < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform
    companies = Company.with_credit_rate.all
    companies.each do |company|
      client =
        ExperianApi::RegisteredCompanyCredit.new(
          company_reg_number: company.credit_rate_registration_number
        )
      next unless client.execute.success?

      CompanyCreditRates::Update
        .new(company: company, params: client.normalized_response)
        .execute
    end
  end
end
