require 'rails_helper'
include ActionDispatch::TestProcess

RSpec.describe News::Images::Create do
  subject { described_class.new(current_user, params) }

  let(:current_user) { create :user }
  let(:news_item_id) { nil }
  let(:binding_hash) { nil }
  let(:params) do
    {
      image: fixture_file_upload('1x1.jpg', 'image/jpg'),
      news_item_id: news_item_id,
      binding_hash: binding_hash
    }
  end

  describe '#execute!' do
    context 'without news item ID or binding hash' do
      it 'creates image' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.created_image).to be_valid
      end

      it 'generates new binding hash' do
        subject.execute!
        expect(subject.created_image.binding_hash).to be_present
      end
    end

    context 'with news item ID' do
      let(:news_item) { create :news_item }
      let(:news_item_id) { news_item.id }

      it 'creates image' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.created_image).to be_valid
        expect(subject.created_image.news_item).to eq(news_item)
      end
    end

    context 'with binding hash' do
      let(:binding_hash) { 'AbCdFg123456' }

      it 'creates image' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.created_image).to be_valid
        expect(subject.created_image.binding_hash).to eq(binding_hash)
      end
    end
  end
end
