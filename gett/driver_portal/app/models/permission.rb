# == Schema Information
#
# Table name: permissions
#
#  id         :bigint(8)        not null, primary key
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Permission < ApplicationRecord
  validates :name, :slug, presence: true
end
