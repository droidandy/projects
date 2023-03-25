# == Schema Information
#
# Table name: statements
#
#  id          :bigint(8)        not null, primary key
#  user_id     :bigint(8)
#  external_id :string
#  pdf         :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Statement < ApplicationRecord
  belongs_to :user, required: false
  validates :external_id, uniqueness: true

  mount_uploader :pdf, BaseUploader
end
