require 'rails_helper'

RSpec.describe Admin::Invoices::MarkAsPaid, type: :service do
  it { is_expected.to be_authorized_by(Admin::Invoices::ManagePolicy) }
  let(:user) { create(:user) }
  let(:invoice) { create(:invoice, amount_cents: 100) }

  service_context { { admin: user } }

  context 'fully paid amount' do
    subject(:service) { described_class.new(invoice: invoice, partial_pay_amount: 100) }

    describe '#execute' do
      it 'executes successfully' do
        expect(service.execute).to be_success
      end

      it 'marks invoice as paid' do
        expect{ service.execute }.to change(invoice, :paid_at).from(nil)
      end

      it 'records admin who did the action' do
        expect{ service.execute }.to change(invoice, :paid_by).to(user)
      end

      it 'updates invoice partial_paid amount' do
        expect{ service.execute }.to change(invoice, :paid_amount_cents).to(100)
      end

      context 'invoice is paid' do
        let(:invoice) { create(:invoice, paid_at: Time.current) }

        it 'executes unsuccessfully' do
          expect(service.execute).not_to be_success
        end
      end

      context 'invoice is under review' do
        let(:invoice) { create(:invoice, under_review: true) }

        it 'sets under_review to false' do
          expect{ service.execute }.to change(invoice, :under_review).to(false)
        end
      end
    end
  end

  context 'partially paid amount' do
    subject(:service) { described_class.new(invoice: invoice, partial_pay_amount: 50) }

    describe '#execute' do
      it 'executes successfully' do
        expect(service.execute).to be_success
      end

      it 'doesnt mark invoice as paid' do
        expect{ service.execute }.not_to change(invoice, :paid?)
      end

      it 'records admin who did the action' do
        expect{ service.execute }.to change(invoice, :paid_by)
      end

      it 'updates invoice partial_paid amount' do
        expect{ service.execute }.to change(invoice, :paid_amount_cents)
      end
    end
  end
end
