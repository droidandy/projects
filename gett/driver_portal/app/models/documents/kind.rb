# == Schema Information
#
# Table name: documents_kinds
#
#  id               :bigint(8)        not null, primary key
#  title            :string
#  slug             :string
#  mandatory        :boolean          default(FALSE), not null
#  owner            :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  definition_class :string
#

class Documents::Kind < ApplicationRecord
  OWNERS = %w[driver vehicle].freeze

  validates :title, :slug, presence: true, uniqueness: true
  validates :owner, presence: true, inclusion: { in: OWNERS }

  has_many :fields, class_name: 'Documents::Field', foreign_key: :kind_id, dependent: :destroy
end
