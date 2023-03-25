require 'rails_helper'

RSpec.describe Messages::CreatePersonal, type: :service do
  describe '#execute' do
    let(:recipient) { create(:member) }
    let(:message_body) { 'some message' }

    subject(:service) { described_class.new(recipient: recipient, message_body: message_body) }

    it 'creates new Message' do
      allow(Faye.messages).to receive(:notify_create_personal)

      expect { service.execute }.to change(Message, :count).by(1)
    end

    it 'sends message' do
      expect(Faye.messages).to receive(:notify_create_personal)

      service.execute

      expect(service). to be_success
      expect(service.errors).to be_blank
    end
  end
end
