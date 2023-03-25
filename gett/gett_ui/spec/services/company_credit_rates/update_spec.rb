require 'rails_helper'

RSpec.describe CompanyCreditRates::Update, type: :service do
  let!(:company) { create(:company) }
  let!(:initial_credit_rate) { create(:company_credit_rate, company: company) }

  subject(:service) do
    described_class.new(company: company, params: params)
  end

  describe 'execute' do
    context 'credit_rate status is ok' do
      let(:params) do
        {
          incorporated_at: Date.new(2010, 1, 1),
          successful_execution: true,
          credit_rating_value: 600,
          credit_rating_status: 'ok'
        }
      end

      it { expect { service.execute }.to change { initial_credit_rate.reload.active }.to(false) }
      it { expect { service.execute }.to change(CompanyCreditRate, :count).from(1).to(2) }

      it 'created new credit_rate record' do
        service.execute
        company.reload

        expect(company.credit_rate.value).to eq 600
      end

      it 'updates company credit_rate fields' do
        service.execute
        company.reload

        expect(company.credit_rate_incorporated_at).to eq(Date.new(2010, 1, 1))
        expect(company.credit_rate_status).to eq('ok')
      end
    end

    context 'credit_rate has low value' do
      let(:params) do
        {
          incorporated_at: Date.new(2010, 1, 1),
          successful_execution: true,
          credit_rating_value: 400,
          credit_rating_status: 'ok'
        }
      end

      it { expect { service.execute }.to change { initial_credit_rate.reload.active }.to(false) }
      it { expect { service.execute }.to change(CompanyCreditRate, :count).from(1).to(2) }

      it 'created new credit_rate record' do
        service.execute
        company.reload

        expect(company.credit_rate.value).to eq 400.0
      end

      it 'updates company credit_rate fields' do
        service.execute
        company.reload

        expect(company.credit_rate_incorporated_at).to eq(Date.new(2010, 1, 1))
        expect(company.credit_rate_status).to eq('bad_credit')
      end

      it 'sends mail notifications' do
        expect(CompanyCreditRateMailer).to receive(:bad_credit_alert).with(company)

        service.execute
      end
    end

    context 'credit_rate has liquidation status' do
      let(:params) do
        {
          incorporated_at: Date.new(2010, 1, 1),
          successful_execution: true,
          credit_rating_value: 600,
          credit_rating_status: 'liquidation'
        }
      end

      it { expect { service.execute }.to change { initial_credit_rate.reload.active }.to(false) }
      it { expect { service.execute }.to change(CompanyCreditRate, :count).from(1).to(2) }

      it 'created new credit_rate record' do
        service.execute
        company.reload

        expect(company.credit_rate.value).to eq 600
      end

      it 'updates company credit_rate fields' do
        service.execute
        company.reload

        expect(company.credit_rate_incorporated_at).to eq(Date.new(2010, 1, 1))
        expect(company.credit_rate_status).to eq('liquidation')
      end

      it 'sends mail notifications' do
        expect(CompanyCreditRateMailer).to receive(:liquidation_alert).with(company)

        service.execute
      end
    end

    context 'credit_rate has unsuccessful execution' do
      let(:params) do
        {
          incorporated_at: Date.new(2010, 1, 1),
          successful_execution: false,
          credit_rating_value: 600,
          credit_rating_status: 'ok'
        }
      end

      it { expect { service.execute }.to change { initial_credit_rate.reload.active }.to(false) }
      it { expect { service.execute }.to change(CompanyCreditRate, :count).from(1).to(2) }

      it 'created new credit_rate record' do
        service.execute
        company.reload

        expect(company.credit_rate.value).to eq 600
      end

      it 'updates company credit_rate fields' do
        service.execute
        company.reload

        expect(company.credit_rate_incorporated_at).to eq(Date.new(2010, 1, 1))
        expect(company.credit_rate_status).to eq('unable_to_check')
      end
    end
  end
end
