# == Schema Information
#
# Table name: documents
#
#  id              :bigint(8)        not null, primary key
#  user_id         :bigint(8)
#  kind_id         :bigint(8)
#  file            :string
#  hidden          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  vehicle_id      :bigint(8)
#  content_type    :string
#  file_name       :string
#  metadata        :jsonb            not null
#  approval_status :integer          default("pending"), not null
#  expires_at      :datetime
#  agent_id        :bigint(8)
#  gett_id         :integer
#  started_at      :datetime
#  unique_id       :string
#

class Document < ApplicationRecord
  EXPIRATION_THRESHOLD = 7.days

  belongs_to :user
  belongs_to :agent, class_name: 'User', required: false
  belongs_to :vehicle, required: false
  belongs_to :kind, class_name: 'Documents::Kind'

  has_many :status_changes, class_name: 'Documents::StatusChange', dependent: :destroy
  has_one :last_change, -> { order(created_at: :desc) }, class_name: 'Documents::StatusChange'

  scope :visible, -> { where(hidden: false) }
  scope :hidden, -> { where(hidden: true) }
  scope :driver_bound, -> { where(vehicle_id: nil) }
  scope :vehicle_bound, -> { where.not(vehicle_id: nil) }

  enum approval_status: %i[pending rejected approved missing], _suffix: true

  mount_uploader :file, DocumentUploader

  def driver_owned?
    kind.owner == 'driver'
  end

  def vehicle_owned?
    kind.owner == 'vehicle'
  end
end
