require 'rails_helper'

RSpec.describe Incomings::GetE::TripStatusUpdateHandler, type: :service do
  let(:service) { Incomings::GetE::TripStatusUpdateHandler.new(payload: payload) }
  let(:payload) do
    {
      data: {
        Unid: 'Unid',
        Status: 'Completed',
        StatusCode: 'COMPLETE',
        Driver: {
          Name: 'John',
          Phone: '31111111111'
        },
        Pricing: {
          Price: {
            Amount: '5'
          }
        }
      }
    }.with_indifferent_access
  end
  let(:incoming) { Incoming.last }

  context 'when valid' do
    let!(:booking) { create(:booking, :creating, service_id: 'Unid') }

    statuses = {
      'BOOKED'    => 'order_received',
      'EN_ROUTE'  => 'on_the_way',
      'AT_PICKUP' => 'arrived',
      'ON_BOARD'  => 'in_progress',
      'COMPLETE'  => 'completed',
      'CANCELLED' => 'cancelled'
    }

    statuses.each do |payload_status, booking_status|
      context "when status is '#{payload_status}'" do
        let(:payload) { super().deep_merge(data: {StatusCode: payload_status}) }

        it 'updates model and notifies' do
          expect(Faye.bookings).to receive(:notify_update).with(booking, hash_including(:indicator, :live_modifier, :future_modifier))

          timestamp = Bookings::TIMESTAMP_MAPPING[booking_status.to_sym]
          expect{ service.execute }
            .to change{ booking.reload.status }.to(booking_status)
            .and change{ booking.reload[timestamp] }

          expect(service).to be_success
          expect(incoming.api_errors).to be_blank
        end
      end
    end

    context "when status is 'Completed'" do
      it 'calls PriceUpdateHandler' do
        allow(Faye.bookings).to receive(:notify_update)
        expect(Incomings::GetE::PriceUpdateHandler).to receive(:new).with(payload: payload)
          .and_return(double(execute: true))
        expect(service.execute).to be_success
      end
    end
  end

  context 'when booking does not exist' do
    it 'creates Incoming record with errors' do
      expect{ service.execute }.to change(Incoming, :count).by(1)
      expect(service).to be_success
      expect(incoming.api_errors).to be_present
    end
  end
end
