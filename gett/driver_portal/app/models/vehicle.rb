# == Schema Information
#
# Table name: vehicles
#
#  id              :bigint(8)        not null, primary key
#  user_id         :bigint(8)
#  title           :string
#  model           :string
#  color           :string
#  plate_number    :string
#  is_current      :boolean          default(FALSE), not null
#  hidden          :boolean          default(FALSE), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  approval_status :integer          default("documents_missing"), not null
#  gett_id         :integer
#

class Vehicle < ApplicationRecord
  validates :title, presence: true, uniqueness: { scope: :user_id }

  belongs_to :user

  has_many :documents, dependent: :destroy

  scope :visible, -> { where(hidden: false) }
  scope :hidden, -> { where(hidden: true) }

  enum approval_status: %i[documents_missing pending rejected approved], _suffix: true
end
