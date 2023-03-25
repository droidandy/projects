require 'rails_helper'

RSpec.describe ExperianApi::RegisteredCompanyCredit, type: :service do
  let(:company_reg_number) { '12345' }

  subject(:service) { described_class.new(company_reg_number: company_reg_number) }

  describe '#execute' do
    let(:response) do
      double(
        code: 200,
        body: Rails.root.join('spec/fixtures/experian_api/registered_company_credit_response.json').read
      )
    end

    before do
      expect(ExperianApi::Authenticate).to receive(:new)
        .and_return(double(execute: true))

      ExperianApi::Base.token_data = { 'access_token' => 'access_token_value' }
    end

    after(:each) do
      # token_data is class attributes and caches between tests
      ExperianApi::Base.token_data = nil
    end

    context 'when Experian API returns success result' do
      before do
        expect(RestClient).to receive(:get)
          .with(
            "https://experian-api.localhost/risk/business/v1/registeredcompanycredit/#{company_reg_number}",
            accept: 'application/json',
            authorization: 'Bearer access_token_value'
          )
          .and_return(response)
        service.execute
      end

      it 'succeeds service' do
        is_expected.to be_success
      end

      it 'contains required data' do
        expect(service.normalized_response).to include(
          credit_rating_status: nil,
          credit_rating_value: nil,
          incorporated_at: '1981-NaN-NaN',
          successful_execution: true
        )
      end
    end

    context 'when Experian API raises exception' do
      let(:error) { RestClient::BadRequest.new }
      let(:response) { double(body: 'Error', code: 400) }

      before do
        allow(error).to receive(:response).and_return(response)
        expect(RestClient).to receive(:get).and_raise(error)

        service.execute
      end

      it 'does not succeed' do
        is_expected.not_to be_success
      end
    end
  end
end
