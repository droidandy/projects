require 'rails_helper'

RSpec.describe News::Comments::Create do
  subject { described_class.new(current_user, params) }

  let(:current_user) { create :user }

  let(:content) { 'Content' }

  let(:params) do
    {
      content: content,
      news_item_id: news_item.id
    }
  end

  describe '#execute!' do
    context 'with published news' do
      let(:news_item) { create :news_item }

      it 'should work' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.comment).to be_valid
      end

      it 'should create comment' do
        expect { subject.execute! }.to change { Comment.count }.by(1)
        expect(subject.comment.commentable).to eq(news_item)
        expect(subject.comment.parent).to eq(nil)
      end

      it 'should increment comments count' do
        expect { subject.execute! }.to change { news_item.reload.comments_count }.by(1)
      end

      context 'with parent comment' do
        let!(:parent_comment) { create :comment, commentable: news_item }

        let(:params) do
          {
            content: content,
            news_item_id: news_item.id,
            parent_id: parent_comment.id
          }
        end

        it 'should work' do
          subject.execute!
          expect(subject).to be_success
          expect(subject.comment).to be_valid
        end

        it 'should create comment' do
          expect { subject.execute! }.to change { Comment.count }.by(1)
          expect(subject.comment.commentable).to eq(news_item)
          expect(subject.comment.parent).to eq(parent_comment)
        end

        it 'should increment comments count' do
          expect { subject.execute! }.to change { news_item.reload.comments_count }.by(1)
        end
      end
    end

    context 'with draft news' do
      let(:news_item) { create :news_item, :unpublished }

      it 'should fail' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ news_item: 'not found' })
      end
    end
  end
end
