require 'rails_helper'

RSpec.describe CompanyPaymentCards::Update, type: :service do
  let(:company) { create :company }
  let(:admin)   { create :admin, company: company }

  it { is_expected.to be_authorized_by(CompanyPaymentCards::Policy) }

  service_context { { member: admin, company: company } }
  subject(:service) do
    described_class.new(params: {
      token: 'token123',
      holder_name: 'John Doe'
    })
  end

  describe 'execute' do
    before do
      token_info_service = double('PaymentsOS::GetTokenInfo')
      expect(token_info_service).to receive(:execute).and_return(token_info_service)
      expect(token_info_service).to receive(:result).and_return(
        last_4: '1234',
        expiration_year: 2020,
        expiration_month: 12
      )
      expect(PaymentsOS::GetTokenInfo).to receive(:new)
        .with(token: 'token123').and_return(token_info_service)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end

    context 'payment card exists' do
      let!(:payment_card) { create :payment_card, :company, company: company }

      it 'deactivates old payment card' do
        expect{ service.execute }.to change{ payment_card.reload.active }.to(false)
      end
    end

    describe 'with outstanding invoice' do
      let!(:invoice) { create(:invoice, company: company) }

      context 'payment created successfully' do
        before do
          payments_service = double('InvoicePayments::CreateAutomatic')
          expect(InvoicePayments::CreateAutomatic).to receive(:new)
            .with(company: company).and_return(payments_service)
          expect(payments_service).to receive(:execute).and_return(payments_service)
          expect(payments_service).to receive(:success?).and_return(true)
        end

        it 'executes successfully' do
          expect(service.execute).to be_success
        end
      end

      context 'payment creation failed' do
        before do
          payments_service = double('InvoicePayments::CreateAutomatic')
          expect(InvoicePayments::CreateAutomatic).to receive(:new).and_return(payments_service)
          expect(payments_service).to receive(:execute).and_return(payments_service)
          expect(payments_service).to receive(:success?).and_return(false)
        end

        it 'does not execute successfully' do
          expect(service.execute).to_not be_success
        end
      end
    end
  end
end
