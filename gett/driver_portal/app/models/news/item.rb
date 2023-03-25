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

module News
  class Item < ApplicationRecord
    TYPES = %w[regular featured numbers].freeze

    belongs_to :author, class_name: 'User'
    has_many :comments, as: :commentable, dependent: :destroy
    has_many :images, dependent: :destroy, foreign_key: :news_item_id
    has_many :likes, as: :likeable, dependent: :destroy
    has_many :views, as: :viewable, dependent: :destroy

    validates :title, :published_at, presence: true
    validates :item_type, presence: true, inclusion: { in: TYPES }
    validates :number, presence: true, if: :numbers_type?
    validates :content, :image, presence: true, unless: :numbers_type?

    scope :published, -> { where('published_at < ?', Time.current) }

    mount_uploader :image, TitleImageUploader

    def numbers_type?
      item_type == 'numbers'
    end

    def published?
      published_at < Time.current
    end
  end
end
