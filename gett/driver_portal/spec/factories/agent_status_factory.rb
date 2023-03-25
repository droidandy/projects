# == Schema Information
#
# Table name: agent_statuses
#
#  id         :bigint(8)        not null, primary key
#  user_id    :bigint(8)        not null
#  status     :integer          not null
#  current    :boolean          default(TRUE), not null
#  created_at :datetime         not null
#  ended_at   :datetime
#

FactoryBot.define do
  factory :agent_status do
    user
    status 'available'
    current true
  end
end
