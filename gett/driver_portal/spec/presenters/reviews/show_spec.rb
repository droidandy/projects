require 'rails_helper'

RSpec.describe Reviews::Show do
  subject { described_class.new(review) }

  let(:review) { create(:review, completed: true, comment: 'Success!') }

  describe '#as_json' do
    let(:json) do
      {
        id: review.id,
        completed: review.completed,
        attempt_number: review.attempt_number
      }
    end

    it 'render review attributes' do
      expect(subject.as_json).to include(json)
    end

    it 'render driver' do
      expect(subject.as_json[:driver]).to eq(
        {
          id: review.driver.id,
          first_name: review.driver.first_name,
          last_name: review.driver.last_name
        }
      )
    end

    context 'with review updates' do
      let!(:review_updates) { create_list :review_update, 2, review: review }

      it 'renders review updates' do
        expect(subject.as_json(with_updates: true)[:review_updates].count).to eq(2)
      end
    end
  end
end
