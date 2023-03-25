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

FactoryBot.define do
  factory :like do
    user
    likeable { create :comment }
    value 1

    factory :dislike do
      value -1
    end
  end
end
