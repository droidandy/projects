require 'rails_helper'

RSpec.describe Messages::Index, type: :service do
  let(:booking) { create(:booking) }
  let(:company) { create(:company) }
  let(:member) { create(:member, company: company) }
  let(:message_body) do
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
  let!(:push_message) { create(:message, recipient: member, body: message_body.to_json, message_type: 'push') }
  let!(:personal_message) { create(:message, recipient: member, message_type: 'personal') }
  let!(:alien_personal_message) { create(:message, message_type: 'personal') }
  let!(:deploy_message) { create(:message, title: 'Last Deploy', message_type: 'deployment') }
  let!(:internal_message) { create(:message, company: company) }
  let!(:external_message) { create(:message, :external) }
  let!(:alien_internal_message) { create(:message) }

  subject(:service) { described_class.new }

  describe '#execute' do
    service_context { { member: member } }

    before { service.execute }

    describe 'results[:items]' do
      subject { service.result }

      it 'returns all messages' do
        messages_ids = service.result[:items].pluck('id')
        expected_ids = [push_message.id, internal_message.id, external_message.id, personal_message.id]

        expect(messages_ids).to match_array(expected_ids)
      end
    end
  end
end
