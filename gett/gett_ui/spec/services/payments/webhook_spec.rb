require 'rails_helper'

describe Payments::Webhook do
  subject(:service) { Payments::Webhook.new(payments_os_id: 'payments_os_id') }

  describe 'execute' do
    context 'payment exists' do
      let(:payment) { create(:payment, payments_os_id: 'payments_os_id') }

      it 'calls Payments::StatusUpdater' do
        status_updater_service = double('Payments::StatusUpdater')
        expect(Payments::StatusUpdater).to receive(:new).with(payment: payment)
          .and_return(status_updater_service)
        expect(status_updater_service).to receive(:execute)

        service.execute
      end
    end

    context 'payment does not exist' do
      it 'does not call Payments::StatusUpdater' do
        expect(Payments::StatusUpdater).to_not receive(:new)

        service.execute
      end
    end
  end
end
