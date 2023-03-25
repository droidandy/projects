require 'rails_helper'

describe GoCardless::Webhook, type: :service do
  let(:events) do
    [
      {
        resource_type: 'mandates',
        links: {
          mandate: 'mandate_id'
        },
        action: 'active'
      },
      {
        resource_type: 'payments',
        links: {
          payment: 'payment_id'
        },
        action: 'paid_out'
      }
    ]
  end

  subject(:service) { GoCardless::Webhook.new(events: events) }

  describe '#execute' do
    context 'mandate exists' do
      let!(:mandate) { create(:direct_debit_mandate, go_cardless_mandate_id: 'mandate_id') }

      before do
        event_processor = double('GoCardless::MandateEventProcessor')
        expect(GoCardless::MandateEventProcessor).to receive(:new).and_return(event_processor)
        expect(event_processor).to receive(:execute)
      end

      it 'processes mandate event' do
        service.execute
      end
    end

    context 'payment exists' do
      let!(:payment) { create(:direct_debit_payment, go_cardless_payment_id: 'payment_id') }

      before do
        event_processor = double('GoCardless::PaymentEventProcessor')
        expect(GoCardless::PaymentEventProcessor).to receive(:new).and_return(event_processor)
        expect(event_processor).to receive(:execute)
      end

      it 'processes payment event' do
        service.execute
      end
    end

    context 'no records exist' do
      before { service.execute }
      it { is_expected.to be_success }
    end
  end
end
