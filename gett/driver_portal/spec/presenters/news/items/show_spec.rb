require 'rails_helper'

RSpec.describe News::Items::Show do
  subject { described_class.new(news_item) }

  let(:author) { create(:user) }

  let(:news_item) do
    create(
      :news_item,
      title: 'Title',
      content: 'Content',
      item_type: 'regular',
      author: author,
      comments_count: 2,
      views_count: 3,
      number: 4
    )
  end

  describe '#as_json' do
    let(:json) do
      {
        id:             news_item.id,
        comments_count: news_item.comments_count,
        content:        news_item.content,
        image_url:      URI.join(Rails.application.config.asset_host, news_item.image_url).to_s,
        item_type:      news_item.item_type,
        number:         news_item.number,
        published:      true,
        published_at:   news_item.published_at,
        title:          news_item.title,
        views_count:    news_item.views_count,
        image_name:     '1x1.jpg',
        author: {
          id: author.id,
          name: author.name
        }
      }
    end

    it 'returns proper json' do
      expect(subject.as_json).to eq(json)
    end
  end
end
