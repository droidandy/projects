require 'rails_helper'

RSpec.describe Likes::Create do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user) }

    let(:comment) { create :comment }
    let(:value) { '1' }
    let(:params) do
      {
        comment_id: comment.id,
        value: value
      }
    end

    it 'should work' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'should create new like model' do
      expect { subject.execute! }.to change{ Like.count }.by(1)
    end

    it 'should recalculate likes count' do
      subject.execute!
      expect(comment.reload.likes_count).to eq(1)
      expect(comment.reload.dislikes_count).to eq(0)
    end

    context 'dislike already liked comment' do
      let(:value) { '-1' }
      let!(:like) { create :like, user: current_user, likeable: comment }

      it 'should not change like models count' do
        expect { subject.execute! }.not_to change{ Like.count }
      end

      it 'should change like value' do
        subject.execute!
        expect(like.reload.value).to eq(-1)
      end

      it 'should recalculate likes count' do
        subject.execute!
        expect(comment.reload.likes_count).to eq(0)
        expect(comment.reload.dislikes_count).to eq(1)
      end
    end
  end
end
