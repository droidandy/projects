require 'rails_helper'

describe ::Reviews::Approve do
  let(:driver) { create(:user, :with_driver_role) }
  let(:reviewer) { create(:user, :with_site_admin_role) }

  subject { described_class.new(reviewer, { driver_id: driver.id }) }

  context 'no review in progress' do
    it 'raises error' do
      expect { subject.execute! }. to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  context 'review in progress' do
    let!(:review) { create(:review, driver: driver, completed: nil) }
    before { subject.execute! }

    it 'finished the review' do
      expect(subject).to be_success
      review = subject.review
      expect(review.completed).to eq(true)
    end

    it 'creates a history record' do
      review_update = subject.review_update
      expect(review_update.attributes).to include(
        'review_id' => review.id,
        'reviewer_id' => reviewer.id,
        'requirement' => 'base',
        'completed' => true
      )
    end
  end
end
