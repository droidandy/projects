# == Schema Information
#
# Table name: views
#
#  id            :bigint(8)        not null, primary key
#  user_id       :bigint(8)
#  viewable_id   :bigint(8)
#  viewable_type :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

FactoryBot.define do
  factory :view do
    user
    viewable { create :news_item }
  end
end
