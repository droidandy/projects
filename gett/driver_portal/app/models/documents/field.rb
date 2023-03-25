# == Schema Information
#
# Table name: documents_fields
#
#  id         :bigint(8)        not null, primary key
#  kind_id    :bigint(8)
#  label      :string
#  name       :string
#  field_type :string
#  mandatory  :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Documents::Field < ApplicationRecord
  TYPES = %w[str date date_time bool color].freeze

  validates :field_type, presence: true, inclusion: { in: TYPES }
  validates :name, presence: true, uniqueness: { scope: :kind_id }
  validates :label, presence: true

  belongs_to :kind, class_name: 'Documents::Kind'
end
