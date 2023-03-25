require 'rails_helper'

RSpec.describe Members::Reinvite do
  describe '#execute' do
    let(:company) { create(:company, :with_contact) }
    let(:member)  { create(:member, company: company) }
    let(:service) { Members::Reinvite.new(member: member, onboard: onboard) }
    let(:onboard) { false }

    it 'executes' do
      service.execute
      expect(service).to be_success
    end

    context 'when member is inactive' do
      let(:member) { create(:member, :inactive) }

      specify { expect(service.execute).not_to be_success }
    end

    it 'resets password token data and sends email' do
      expect(MembersMailer).to receive_message_chain(:invitation, :deliver_later)
      expect{ service.execute }.to change{ member.reset_password_token }.from(nil)
        .and change{ member.reset_password_sent_at }.from(nil)
    end

    context 'with onboard flag set to true' do
      let(:onboard) { true }

      it 'sets onboarding to true' do
        expect{ service.execute }.to change{ member.onboarding }.from(nil).to(true)
      end
    end
  end
end
