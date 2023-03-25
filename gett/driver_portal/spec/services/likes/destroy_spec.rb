require 'rails_helper'

RSpec.describe Likes::Destroy do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user) }

    let(:comment) { create :comment }
    let(:params) do
      {
        comment_id: comment.id
      }
    end

    context 'without like' do
      it 'should fail' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq(base: 'Comment is not liked')
      end
    end

    context 'with like' do
      let!(:like) { create :like, user: current_user, likeable: comment }
      
      it 'should work' do
        subject.execute!
        expect(subject).to be_success
      end

      it 'should remove like model' do
        expect { subject.execute! }.to change{ Like.count }.by(-1)
      end

      it 'should recalculate likes count' do
        subject.execute!
        expect(comment.reload.likes_count).to eq(0)
        expect(comment.reload.dislikes_count).to eq(0)
      end
    end
  end
end
