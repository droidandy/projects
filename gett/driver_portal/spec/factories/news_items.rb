# == Schema Information
#
# Table name: news_items
#
#  id             :bigint(8)        not null, primary key
#  title          :string
#  image          :string
#  content        :text
#  published_at   :datetime
#  author_id      :bigint(8)
#  item_type      :string
#  comments_count :integer          default(0)
#  number         :float
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  views_count    :integer          default(0)
#  trending_index :integer          default(0), not null
#

FactoryBot.define do
  factory :news_item, class: 'News::Item' do
    author
    sequence(:title) { |i| "Title #{i}" }
    item_type 'regular'
    content '<div>Content</div>'
    image File.open(Rails.root.join('spec', 'samples', 'files', '1x1.jpg'))
    published_at { Time.current - 1.hour }

    trait :unpublished do
      published_at { Time.current + 1.hour }
    end
  end
end
