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

class StatisticsEntry < ApplicationRecord
  validates :date, presence: true, uniqueness: true
  validates :active_users, :login_count, presence: true
end
