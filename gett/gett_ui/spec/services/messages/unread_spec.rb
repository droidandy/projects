require 'rails_helper'

RSpec.describe Messages::Unread, type: :service do
  let(:company)  { member.company }
  let(:member)   { create :member }
  let!(:message) { create :message, company: company }
  let(:service)  { Messages::Unread.new }

  service_context { { member: member } }

  it { is_expected.to be_authorized_by Messages::UnreadPolicy }

  describe '#execute' do
    subject { service.execute.result.pluck('id') }

    context 'notification_seen_at > 24 hours from now' do
      let(:member) { create :member, notification_seen_at: Time.current - 26.hours }
      let!(:old_message) { create :message, company: company, created_at: Time.current - 25.hours }

      it { is_expected.to     include message.id }
      it { is_expected.not_to include old_message.id }
    end

    context 'notification_seen_at < 24 hours from now' do
      let(:member) { create :member, notification_seen_at: Time.current - 10.hours }
      let!(:seen_message) { create :message, company: company, created_at: Time.current - 11.hours }

      it { is_expected.to     include message.id }
      it { is_expected.not_to include seen_message.id }
    end
  end
end
