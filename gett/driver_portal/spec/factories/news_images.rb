# == Schema Information
#
# Table name: news_images
#
#  id           :bigint(8)        not null, primary key
#  news_item_id :bigint(8)
#  image        :string
#  binding_hash :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

FactoryBot.define do
  factory :news_image, class: 'News::Image' do
    image { File.open(Rails.root.join('spec', 'samples', 'files', "1x1.jpg")) }

    trait :with_news_item do
      news_item
    end

    trait :without_news_item do
      binding_hash { SecureRandom.urlsafe_base64 }
    end
  end
end
