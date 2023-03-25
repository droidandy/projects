require 'rails_helper'

RSpec.describe News::Images::Show do
  subject { described_class.new(image) }

  let(:image) { create(:news_image, :without_news_item) }

  describe '#as_json' do
    let(:json) do
      {
        id: image.id,
        image_url: URI.join(Rails.application.config.asset_host, "/api/v1/news/images/#{image.id}").to_s,
        binding_hash: image.binding_hash
      }
    end

    it 'returns proper json' do
      expect(subject.as_json).to eq(json)
    end
  end
end
