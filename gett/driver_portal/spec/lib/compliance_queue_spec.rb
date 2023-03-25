require 'rails_helper'
require 'compliance_queue'

RSpec.describe ComplianceQueue do
  subject { described_class.new(driver) }

  context 'driver is not in queue' do
    let(:driver) { create(:user, ready_for_approval_since: nil) }

    it 'removes driver from the leaderboard' do
      subject.update_position
      expect(subject.position).to be_nil
    end
  end

  context 'driver is in queue' do
    let(:driver) { create(:user, ready_for_approval_since: Time.current) }

    context 'driver has no pending documents' do
      it 'removes driver from the leaderboard' do
        subject.update_position
        expect(subject.position).to be_nil
      end
    end

    context 'driver has pending documents' do
      before { create(:document, user: driver) }

      it 'adds driver to the leaderboard' do
        subject.update_position
        expect(subject.position).to eq(1)
      end

      context 'another driver exists' do
        before do
          other_driver = create(:user, ready_for_approval_since: 1.day.ago)
          create(:document, user: other_driver)
          described_class.new(other_driver).update_position
        end

        it 'ranks driver by ready_for_approval_since' do
          subject.update_position
          expect(subject.position).to eq(2)
        end
      end
    end
  end
end
