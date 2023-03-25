# == Schema Information
#
# Table name: reviews
#
#  id                  :bigint(8)        not null, primary key
#  driver_id           :bigint(8)        not null
#  completed           :boolean
#  comment             :text
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  attempt_number      :integer          default(1), not null
#  scheduled_at        :datetime
#  checkin_at          :datetime
#  training_start_at   :datetime
#  training_end_at     :datetime
#  identity_checked_at :datetime
#  assigned_at         :datetime
#  agent_id            :integer
#

class Review < ApplicationRecord
  belongs_to :driver, class_name: 'User'
  belongs_to :agent, class_name: 'User', required: false
  has_many :review_updates, dependent: :destroy

  scope :in_progress, -> { where(completed: nil) }
  scope :completed, -> { where.not(completed: nil) }
  scope :chronological, -> { order(:created_at) }
end
