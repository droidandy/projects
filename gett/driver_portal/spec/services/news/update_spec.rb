require 'rails_helper'
require 'support/shared_examples/service_examples'
include ActionDispatch::TestProcess

RSpec.describe News::Update do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create :user }

    let(:news_item) do
      create :news_item,
        title: 'Old Title',
        item_type: 'numbers',
        number: 42
    end
    let(:published_at) { Time.current.iso8601 }

    let(:params) do
      {
        news_item_id: news_item.id,
        title: 'New Title',
        item_type: 'regular',
        published_at: published_at,
        content: 'New Content',
        image: fixture_file_upload('1x1.jpg', 'image/jpg')
      }
    end

    include_examples 'it uses policy', News::ItemPolicy, :update?

    it 'should work' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'should update news item' do
      subject.execute!
      expect(subject.news_item.title).to eq('New Title')
      expect(subject.news_item.item_type).to eq('regular')
      expect(subject.news_item.published_at).to eq(published_at)
      expect(subject.news_item.content).to eq('New Content')
      expect(subject.news_item.image_url).to be_present
      expect(subject.news_item.number).not_to be_present
    end
  end
end
