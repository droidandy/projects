RSpec.describe Messages::MarkAllAsRead do
  describe '#execute' do
    let(:company) { create :company }
    let(:member) { create :member, company: company }

    let(:context) do
      { user: member, company: company }
    end

    subject(:service) { Messages::MarkAllAsRead.new(context) }

    it "updates member's field last_notification_received_at" do
      expect{ service.execute }.to change{ member.reload.notification_seen_at }
    end

    describe 'execution results' do
      before { service.execute }

      it { is_expected.to be_success }
    end
  end
end
