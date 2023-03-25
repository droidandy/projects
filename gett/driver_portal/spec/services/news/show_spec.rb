require 'rails_helper'

RSpec.describe News::Show do
  subject { described_class.new(current_user, params) }

  let(:current_user) { create :user }
  let(:news_item) { create :news_item }
  let(:news_item_id) { news_item.id }

  let(:params) do
    {
      news_item_id: news_item_id
    }
  end

  describe '#execute!' do
    context 'with existing news item' do
      it 'returns news item' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.news_item).to eq(news_item)
      end

      it 'increments views count' do
        expect { subject.execute! }.to change { news_item.reload.views_count }.by(1)
      end

      it 'create View entry' do
        expect { subject.execute! }.to change { news_item.views.count }.by(1)
      end

      it 'counts trending index' do
        create_list :view, 2, viewable: news_item, user: current_user, created_at: Time.now - 5.weeks
        create_list :view, 3, viewable: news_item, user: current_user, created_at: Time.now - 2.weeks
        subject.execute!
        expect(subject.news_item.trending_index).to eq 4
      end

      context 'with admin user' do
        let(:current_user) { create :user, :with_site_admin_role }

        it 'does not count as view' do
          expect { subject.execute! }.not_to change { news_item.reload.views_count }
        end
      end
    end

    context 'with wrong item ID' do
      let(:news_item_id) { 0 }

      it 'raises error' do
        expect { subject.execute! }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
