# == Schema Information
#
# Table name: views
#
#  id            :bigint(8)        not null, primary key
#  user_id       :bigint(8)
#  viewable_id   :bigint(8)
#  viewable_type :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class View < ApplicationRecord
  belongs_to :user
  belongs_to :viewable, polymorphic: true
end
