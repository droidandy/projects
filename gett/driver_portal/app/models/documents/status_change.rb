# == Schema Information
#
# Table name: documents_status_changes
#
#  id          :bigint(8)        not null, primary key
#  user_id     :bigint(8)
#  document_id :bigint(8)
#  status      :string
#  comment     :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Documents::StatusChange < ApplicationRecord
  belongs_to :user
  belongs_to :document

  validates :status, presence: true
end
