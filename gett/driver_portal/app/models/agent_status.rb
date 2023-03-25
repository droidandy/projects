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

class AgentStatus < ApplicationRecord
  belongs_to :user
  validates :status, presence: true
  validates :ended_at, presence: { unless: :current }
  validates :current, uniqueness: { scope: :user_id, if: :current }

  scope :current, -> { where(current: true) }

  enum status: %i[
    available
    in_progress
    busy
    offline
  ]
end
