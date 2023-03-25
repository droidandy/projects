require 'rails_helper'

RSpec.describe Mobile::V1::Messages::Recent, type: :service do
  let(:booking) { create(:booking) }
  let(:company) { create(:company) }
  let(:member_created_at) { DateTime.current }
  let(:member) { create(:member, company: company, created_at: member_created_at) }
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
  let!(:push_message)     { create(:message, :push, recipient: member, body: message_body.to_json, created_at: member_created_at + 1.second) }
  let!(:personal_message) { create(:message, :personal, recipient: member, created_at: member_created_at + 2.seconds) }
  let!(:internal_message) { create(:message, company: company, created_at: member_created_at + 3.seconds) }
  let!(:external_message) { create(:message, :external, created_at: member_created_at + 4.seconds) }

  let!(:old_push_message)     { create(:message, :push, recipient: member, body: message_body.to_json, created_at: member_created_at - 1.second) }
  let!(:old_personal_message) { create(:message, :personal, recipient: member, created_at: member_created_at - 2.seconds) }
  let!(:old_internal_message) { create(:message, company: company, created_at: member_created_at - 3.seconds) }
  let!(:old_external_message) { create(:message, :external, created_at: member_created_at - 4.seconds) }

  let!(:deploy_message)                 { create(:message, title: 'Last Deploy', message_type: 'deployment', created_at: member_created_at + 1.second) }
  let!(:other_member_personal_message)  { create(:message, :personal, created_at: member_created_at + 1.second) }
  let!(:other_company_internal_message) { create(:message, created_at: member_created_at + 1.second) }

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
