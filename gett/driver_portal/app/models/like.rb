# == Schema Information
#
# Table name: likes
#
#  id            :bigint(8)        not null, primary key
#  user_id       :bigint(8)
#  likeable_id   :bigint(8)
#  likeable_type :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  value         :integer          default(1), not null
#

class Like < ApplicationRecord
  VALUES = [1, -1].freeze

  belongs_to :user
  belongs_to :likeable, polymorphic: true

  validates :user_id, uniqueness: { scope: %i[likeable_type likeable_id] }
  validates :value, presence: true, inclusion: { in: VALUES }
end
