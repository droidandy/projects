require 'rails_helper'

RSpec.describe Messages::CreatePush, type: :service do
  describe '#execute' do
    let(:passenger) { create(:passenger) }
    let(:booking)   { create(:booking, passenger: passenger) }
    let(:push_data) do
      {
        data: {
          kind: 'booking_status_change',
          booking_id: booking.id
        },
        notification: {
          body: 'Your taxi is on the way'
        }
      }
    end

    subject(:service) { described_class.new(recipient: passenger, push_data: push_data) }

    it 'creates new Message' do
      expect{ service.execute }.to change(Message, :count).by(1)
    end

    describe 'created message' do
      subject { passenger.received_messages.last }

      before { service.execute }

      its(:data) { is_expected.to eq(push_data) }
      its(:message_body) { is_expected.to eq('Your taxi is on the way') }
    end
  end
end
