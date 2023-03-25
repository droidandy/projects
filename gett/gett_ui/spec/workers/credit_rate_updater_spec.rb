require 'rails_helper'

RSpec.describe CreditRateUpdater, type: :worker do
  let(:worker) { CreditRateUpdater.new }

  let!(:company) { create(:company, :enterprise, credit_rate_registration_number: '12345') }
  let!(:company_without_reg_number) { create(:company, :enterprise, credit_rate_registration_number: '') }

  let(:normalized_response) do
    {
      incorporated_at: '2010-01-01',
      credit_rating_status: ['Ok'],
      credit_rating_value: 555
    }
  end

  context 'successful result' do
    let(:service_result_stub) do
      double(execute: double(success?: true), normalized_response: normalized_response)
    end

    before do
      expect(ExperianApi::RegisteredCompanyCredit)
        .to receive(:new)
        .with(company_reg_number: company.credit_rate_registration_number)
        .and_return(service_result_stub)
    end

    it 'calls CompanyCreditRates updater' do
      expect(CompanyCreditRates::Update)
        .to receive(:new)
        .with(company: company, params: normalized_response)
        .and_call_original

      worker.perform
    end
  end

  context 'unsuccessful result' do
    let(:service_result_stub) do
      double(execute: double(success?: false))
    end

    before do
      expect(ExperianApi::RegisteredCompanyCredit)
        .to receive(:new)
        .with(company_reg_number: company.credit_rate_registration_number)
        .and_return(service_result_stub)
    end

    it 'calls CompanyCreditRates updater' do
      expect(CompanyCreditRates::Update)
        .not_to receive(:new)

      worker.perform
    end
  end
end
