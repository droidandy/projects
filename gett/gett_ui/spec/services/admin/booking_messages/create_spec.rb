require 'rails_helper'

RSpec.describe Admin::BookingMessages::Create, type: :service do
  let(:admin)   { create :user, :admin }
  let(:booking) { create :booking }

  subject(:service) do
    Admin::BookingMessages::Create.new(
      booking: booking,
      text: 'foo bar',
      phones: ['+44712341234', '+44700001111']
    )
  end

  service_context { {admin: admin} }

  describe '#execute' do
    let(:sms_service) { double(execute: true) }

    before{ allow(Nexmo::SMS).to receive(:new).and_return(sms_service) }

    it 'creates a new booking message' do
      expect{ service.execute }.to change(BookingMessage, :count).by(1)
    end

    it 'notifies members' do
      service.execute
      expect(sms_service).to have_received(:execute)
    end
  end
end
