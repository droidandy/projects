# == Schema Information
#
# Table name: review_updates
#
#  id          :bigint(8)        not null, primary key
#  review_id   :bigint(8)        not null
#  reviewer_id :bigint(8)        not null
#  requirement :integer          not null
#  completed   :boolean
#  comment     :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  current     :boolean          default(TRUE), not null
#

class ReviewUpdate < ApplicationRecord
  belongs_to :review
  belongs_to :reviewer, class_name: 'User'

  enum requirement: %i[
    base
    language
    training
    attitude_competence
    vehicle
    phone_contract
  ]

  scope :chronological, -> { order(:created_at) }
  scope :current, -> { where(current: true).where.not(requirement: requirements[:base]) }

  delegate :driver, to: :review
end
