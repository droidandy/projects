# == Schema Information
#
# Table name: statistics_entries
#
#  id           :bigint(8)        not null, primary key
#  date         :date
#  active_users :integer          default(0)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  login_count  :integer          default(0)
#

FactoryBot.define do
  factory :statistics_entry do
    transient do
      start_point Date.parse('2017-12-01')
    end

    sequence(:date) { |n| start_point + (n-1).days }
    sequence(:active_users) { |n| n * 2 }
    sequence(:login_count) { |n| n * 3 }
  end
end
