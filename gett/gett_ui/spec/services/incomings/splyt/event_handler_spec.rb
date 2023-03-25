require 'rails_helper'

RSpec.describe Incomings::Splyt::EventHandler do
  subject(:service) { described_class.new(params: params) }

  describe '#execute' do
    let(:booking_status_updater)             { double(:booking_status_updater, execute: true, result: true) }
    let(:booking_status_updater_with_result) { double(:booking_status_updater_with_result, success?: true) }
    let(:receipt_handler)                    { double(:receipt_handler, execute: true, result: true) }
    let(:receipt_handler_with_result)        { double(:receipt_handler_with_result, success?: true) }

    context 'when there is booking status updated event' do
      let(:params) do
        {
          event: {
            name: described_class::BOOKING_UPDATED
          },
          data: {
            status: 'en-route',
            booking_id: '1'
          }
        }
      end

      it 'builds BookingStatusUpdater with en-route status' do
        expect(Incomings::Splyt::BookingStatusUpdater).to receive(:new)
          .with(payload: params)
          .and_return(booking_status_updater)
        expect(booking_status_updater).to receive(:execute).and_return(booking_status_updater_with_result)

        service.execute
      end
    end

    context 'when there is booking vehicle reassigned event' do
      let(:params) do
        {
          event: {
            name: described_class::BOOKING_REASSIGNED
          },
          data: {
            booking_id: '1'
          }
        }
      end

      let(:payload) { params.deep_merge(data: { status: 'reassigned' }) }

      it 'builds BookingStatusUpdater with reassigned status' do
        expect(Incomings::Splyt::BookingStatusUpdater).to receive(:new)
          .with(payload: payload)
          .and_return(booking_status_updater)
        expect(booking_status_updater).to receive(:execute).and_return(booking_status_updater_with_result)

        service.execute
      end
    end

    context 'when there is ping event' do
      let(:params) do
        {
          event: {
            name: described_class::PING
          }
        }
      end

      let(:dummy_event_handler)             { double(:dummy_event_handler, result: true) }
      let(:dummy_event_handler_with_result) { double(:dummy_event_handler_with_result, success?: true) }

      it 'builds DummyEventHandler' do
        expect(Incomings::Splyt::DummyEventHandler).to receive(:new).and_return(dummy_event_handler)
        expect(dummy_event_handler).to receive(:execute).and_return(dummy_event_handler_with_result)

        service.execute
      end
    end

    context 'when there is receipt created event' do
      let(:params) do
        {
          event: {
            name: described_class::RECEIPT_CREATED
          }
        }
      end

      it 'calls ReceiptHandler' do
        expect(Incomings::Splyt::ReceiptHandler).to receive(:new)
          .with(payload: params)
          .and_return(receipt_handler)
        expect(receipt_handler).to receive(:execute).and_return(receipt_handler_with_result)

        service.execute
      end
    end

    context 'when there is receipt updated event' do
      let(:params) do
        {
          event: {
            name: described_class::RECEIPT_UPDATED
          }
        }
      end

      it 'calls ReceiptHandler' do
        expect(Incomings::Splyt::ReceiptHandler).to receive(:new)
          .with(payload: params)
          .and_return(receipt_handler)
        expect(receipt_handler).to receive(:execute).and_return(receipt_handler_with_result)

        service.execute
      end
    end

    context 'when there is undefined event' do
      let(:params) do
        {
          event: {
            name: 'test event'
          }
        }
      end

      it 'raises an error' do
        expect { service.execute }.to raise_error('Splyt Event Handler for event test event not found')
      end
    end
  end
end
