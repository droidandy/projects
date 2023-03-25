require 'rails_helper'

describe ::Reviews::RejectItem do
  let(:driver) { create(:user, :with_driver_role) }
  let(:reviewer) { create(:user, :with_site_admin_role) }

  subject do
    described_class.new(reviewer, {
      driver_id: driver.id,
      requirement: 'vehicle',
      comment: 'Comment'
    })
  end

  context 'no review in progress' do
    it 'raises error' do
      expect { subject.execute! }. to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  context 'review conducted by current user' do
    let!(:review) { create(:review, driver: driver, completed: nil) }
    let!(:old_review_update) do
      create(:review_update, review: review, requirement: 'vehicle', completed: true)
    end
    before { subject.execute! }

    it 'rejects review requirement' do
      expect(subject).to be_success
      expect(subject.review_update.current).to be(true)
      expect(old_review_update.reload.current).to be(false)
    end

    it 'creates a history record' do
      review_update = subject.review_update
      expect(review_update.attributes).to include(
        'review_id' => review.id,
        'reviewer_id' => reviewer.id,
        'completed' => false,
        'requirement' => 'vehicle',
        'comment' => 'Comment'
      )
    end
  end
end
