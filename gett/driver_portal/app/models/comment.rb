# == Schema Information
#
# Table name: comments
#
#  id               :bigint(8)        not null, primary key
#  user_id          :bigint(8)
#  commentable_id   :bigint(8)
#  commentable_type :string
#  content          :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  parent_id        :bigint(8)
#  likes_count      :integer          default(0)
#  dislikes_count   :integer          default(0)
#

class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :commentable, polymorphic: true
  belongs_to :parent, required: false, class_name: 'Comment'
  has_many :comments, foreign_key: :parent_id, dependent: :destroy
  has_many :likes, as: :likeable, dependent: :destroy

  scope :root, -> { where(parent_id: nil) }
end
