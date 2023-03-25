require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe News::Destroy do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create :user }

    let!(:news_item) { create :news_item }
    let(:news_item_id) { news_item.id }

    let(:params) do
      {
        news_item_id: news_item_id
      }
    end

    include_examples 'it uses policy', News::ItemPolicy, :destroy?

    it 'should work' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'should destroy news item' do
      subject.execute!
      expect(News::Item.find_by(id: news_item_id)).to be_nil
    end

    context 'with wrong ID' do
      let(:news_item_id) { 0 }

      it 'fails' do
        expect { subject.execute! }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
