require 'rails_helper'

RSpec.describe ReviewUpdates::Show do
  subject { described_class.new(review_update) }

  let(:review_update) { create(:review_update, completed: true, comment: 'Success!') }

  describe '#as_json' do
    let(:attributes) do
      {
        id:          review_update.id,
        created_at:  review_update.created_at,
        comment:     review_update.comment,
        completed:   review_update.completed,
        current:     review_update.current,
        requirement: review_update.requirement,
        review_id:   review_update.review_id
      }
    end

    it 'render review update attributes' do
      expect(subject.as_json).to include(attributes)
    end

    it 'render reviewer' do
      expect(subject.as_json[:reviewer]).to eq(
        {
          id: review_update.reviewer.id,
          first_name: review_update.reviewer.first_name,
          last_name: review_update.reviewer.last_name
        }
      )
    end
  end
end
