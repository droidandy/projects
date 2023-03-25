# == Schema Information
#
# Table name: user_stats
#
#  id               :bigint(8)        not null, primary key
#  user_id          :bigint(8)
#  completed_orders :integer          default(0)
#  cancelled_orders :integer          default(0)
#  cash_fare        :float            default(0.0)
#  card_fare        :float            default(0.0)
#  tips             :float            default(0.0)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

FactoryBot.define do
  factory :user_stat do
    user
  end
end
