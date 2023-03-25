require 'rails_helper'

RSpec.describe Admin::Members::ToggleNotifications, type: :service do
  it { is_expected.to be_authorized_by(Admin::Members::ToggleNotificationsPolicy) }

  let(:company) { create(:company) }

  let!(:member) do
    create(
      :member,
      company: company,
      notify_with_email: true,
      notify_with_sms: false,
      notify_with_push: true
    )
  end

  describe '#execute' do
    context 'allowed fields' do
      subject(:service) do
        described_class.new(
          company: company,
          params: {
            notify_with_email: false,
            notify_with_sms: true,
            notify_with_push: false
          }
        )
      end

      it 'updates notification flags on members' do
        service.execute
        expect(service).to be_success
        member.reload
        expect(member.values).to include(
          notify_with_email: false,
          notify_with_sms: true,
          notify_with_push: false
        )
      end
    end

    context 'forbidden fields' do
      subject(:service) do
        described_class.new(
          company: company,
          params: {
            notify_with_sms: false,
            notify_with_email: true,
            notify_with_pidgeon: false
          }
        )
      end

      it 'fails' do
        expect(service.execute).not_to be_success
      end
    end
  end
end
