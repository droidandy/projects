require 'rails_helper'

RSpec.describe Documents::StatusChanges::Show do
  subject { described_class.new(change) }

  let(:change) { create(:documents_status_change) }

  describe '#as_json' do
    let(:json) do
      {
        comment: change.comment,
        created_at: change.created_at,
        status: change.status,
        user_id: change.user_id,
        user_name: change.user.name
      }
    end

    it 'returns proper json' do
      expect(subject.as_json).to eq(json)
    end
  end
end
