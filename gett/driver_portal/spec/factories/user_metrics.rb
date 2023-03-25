# == Schema Information
#
# Table name: user_metrics
#
#  id               :bigint(8)        not null, primary key
#  user_id          :bigint(8)
#  rating           :float            default(0.0)
#  today_acceptance :float            default(0.0)
#  week_acceptance  :float            default(0.0)
#  month_acceptance :float            default(0.0)
#  total_acceptance :float            default(0.0)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

FactoryBot.define do
  factory :user_metric do
    user
  end
end
