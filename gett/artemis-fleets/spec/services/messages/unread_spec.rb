RSpec.describe Messages::Unread do
  let(:company)  { create :company }
  let(:member)   { create :member, company: company }
  let(:message) { create :message, sender: member, company: company }
  let(:context) do
    { user: member, company: company }
  end
  let(:service)  { Messages::Unread.new(context, {message: message}) }

  describe '#execute' do
    subject { service.execute.result.pluck('id') }

    context 'notification_seen_at > 24 hours from now' do
      let(:member) { create :member, company: company, notification_seen_at: Time.current - 26.hours }
      let(:old_message) { create :message, company: company, created_at: Time.current - 25.hours }

      it { is_expected.to     include message.id }
      it { is_expected.not_to include old_message.id }
    end

    context 'notification_seen_at < 24 hours from now' do
      let(:member) { create :member, notification_seen_at: Time.current - 10.hours }
      let!(:seen_message) { create :message, company: company, created_at: Time.current - 11.hours }

      it { is_expected.to     include message.id }
      it { is_expected.not_to include seen_message.id }
    end

    context 'messages from users and system wide' do
      let!(:regular_message) { create :message, company: company }
      let!(:admin_message) { create :message, company: nil }

      it { is_expected.to include regular_message.id }
      it { is_expected.to include admin_message.id }
    end
  end
end
