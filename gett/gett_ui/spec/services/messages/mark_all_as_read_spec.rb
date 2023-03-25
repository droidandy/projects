require 'rails_helper'

RSpec.describe Messages::MarkAllAsRead, type: :service do
  describe '#execute' do
    let!(:booker) { create :booker }

    service_context { { member: booker } }

    subject(:service) { Messages::MarkAllAsRead.new }

    it "updates member's field last_notification_received_at" do
      expect{ service.execute }.to change{ booker.reload.notification_seen_at }
    end

    describe 'execution results' do
      before { service.execute }

      it { is_expected.to be_success }
    end
  end
end
