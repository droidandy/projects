require 'rails_helper'

RSpec.describe Payments::StatusUpdater, type: :service do
  describe '#execute' do
    let(:booking) do
      create(:booking, :with_driver, :personal_card,
        started_at: 10.minutes.from_now,
        ended_at: 20.minutes.from_now
      )
    end

    let(:payment) { create(:payment, status: 'initialized', payments_os_id: 'payments-os-id', booking: booking) }

    subject(:service) { Payments::StatusUpdater.new(payment: payment) }
    let(:payment_info_service) { double('PaymentsOS::GetPaymentInfo') }

    before do
      expect(PaymentsOS::GetPaymentInfo).to receive(:new)
        .with(payment_id: 'payments-os-id', expand: 'all')
        .and_return(payment_info_service)
    end

    describe 'execution result' do
      before { expect(payment_info_service).to receive(:execute) }

      context 'when payment info service succeeds' do
        before do
          expect(payment_info_service).to receive(:success?).and_return(true)
          expect(payment_info_service).to receive_message_chain(:response, :data).and_return(charge_data)
        end

        context 'payment is already successfull' do
          let(:charge_data) { { 'status' => 'Captured', 'key' => 'value' } }
          before { payment.update(status: 'captured') }

          it 'takes no action' do
            expect(CardReceiptMailer).to_not receive(:card_receipt)
            expect{ service.execute }.to_not change{ payment.reload.updated_at }
          end
        end

        context 'when charge data reflects successful charge' do
          let(:charge_data) { { 'status' => 'Captured', 'key' => 'value' } }

          it 'updates status, updates booking to billed and sends email for booking receipt' do
            expect(CardReceiptMailer).to receive_message_chain(:card_receipt, :deliver_later)
            expect{ service.execute }.to change{ booking.reload.billed? }.from(false).to(true)
              .and change{ payment.reload.status }.to('captured')
          end

          context 'when payment is not related with order' do
            let(:invoice) { create(:invoice) }
            let(:payment) { create(:payment, status: 'initialized', payments_os_id: 'payments-os-id', booking: nil, invoice_pks: [invoice.id]) }

            it 'updates status and does not send booking emails' do
              receipt_service = double('Invoices::Receipt')
              expect(Invoices::Receipt).to receive(:new).with(invoice: invoice).and_return(receipt_service)
              expect(receipt_service).to receive(:execute)
              expect{ service.execute }.to change{ payment.reload.status }.to('captured')
            end
          end
        end

        context 'when charge data does not reflect successful charge' do
          let(:charge_data) do
            {
              'status' => 'Initialized',
              'related_resources' => {
                'charges' => [{
                  'created' => '123',
                  'result' => { 'key1' => 'value', 'key2' => 'value' }
                }]
              }
            }
          end

          it 'repeats payment and saves errors from charge' do
            expect(BookingPaymentsWorker).to receive(:perform_in).with(anything, booking.id)
            service.execute
            expect(payment.reload.error_description).to eq 'key1: value; key2: value'
          end
        end
      end
    end
  end
end
