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

module News
  class Image < ApplicationRecord
    belongs_to :news_item, required: false, class_name: 'News::Item'

    validates :image, presence: true

    mount_uploader :image, ImageUploader
  end
end
