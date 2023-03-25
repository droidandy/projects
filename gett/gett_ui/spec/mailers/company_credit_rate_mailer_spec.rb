require 'rails_helper'

describe CompanyCreditRateMailer, type: :mailer do
  describe '#bad_credit_alert' do
    let(:mail) { described_class.bad_credit_alert(company) }
    let(:company) { build(:company, credit_rate_status: Company::CreditRateStatus::BAD_CREDIT) }

    it 'renders the headers' do
      expect(mail.subject).to eq('One Transport Enterprise Credit Check Notification')
    end
  end

  describe '#liquidation_alert' do
    let(:mail) { described_class.liquidation_alert(company) }

    context 'liquidation status' do
      let(:company) { build(:company, credit_rate_status: Company::CreditRateStatus::BANKRUPTCY) }

      it 'renders the headers' do
        expect(mail.subject).to eq('One Transport Enterprise Bankruptcy Notification')
      end
    end

    context 'bankruptcy' do
      let(:company) { build(:company, credit_rate_status: Company::CreditRateStatus::LIQUIDATION) }

      it 'renders the headers' do
        expect(mail.subject).to eq('One Transport Enterprise Liquidation Notification')
      end
    end

    context 'ccj' do
      let(:company) { build(:company, credit_rate_status: Company::CreditRateStatus::CCJ) }

      it 'renders the headers' do
        expect(mail.subject).to eq('One Transport Enterprise CCJ Notification')
      end
    end
  end
end
