require 'rails_helper'

RSpec.describe Users::Assignment::Show do
  subject { described_class.new(user) }

  let(:user) { create :user, phone: '1234', license_number: 'license_number' }
  let!(:review) do
    create :review,
           driver: user,
           checkin_at: Time.now,
           scheduled_at: 1.minute.ago,
           identity_checked_at: 2.minutes.ago
  end

  describe '#as_json' do
    let(:json) do
      {
        id: user.id,
        license: user.license_number,
        phone: user.phone,
        name: user.name,
        scheduled_at: user.review.scheduled_at,
        checkin_at: user.review.checkin_at,
        identity_checked_at: user.review.identity_checked_at,
        documents_ready: false
      }
    end

    it 'render review attributes' do
      expect(subject.as_json).to include(json)
    end

    context 'with review assigned' do
      let(:agent) { create :user }
      before(:each) do
        review.update(agent: agent)
      end

      it 'render agent data' do
        expect(subject.as_json[:agent]).to eq(
          {
            id: agent.id,
            name: agent.name
          }
        )
      end
    end
  end
end
