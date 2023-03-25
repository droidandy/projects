# == Schema Information
#
# Table name: invites
#
#  id           :bigint(8)        not null, primary key
#  user_id      :bigint(8)
#  sender_id    :bigint(8)
#  accepted_at  :datetime
#  expires_at   :datetime
#  token_digest :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  step         :integer          default("info"), not null
#

class Invite < ApplicationRecord
  belongs_to :user
  belongs_to :sender, class_name: 'User'

  validates :token_digest, presence: true

  enum step: %i[info password brief accepted], _suffix: true

  def expired?(now = Time.current)
    expires_at.present? && now > expires_at
  end
end
