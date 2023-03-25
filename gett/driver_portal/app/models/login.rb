# == Schema Information
#
# Table name: logins
#
#  id         :bigint(8)        not null, primary key
#  user_id    :bigint(8)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Login < ApplicationRecord
  belongs_to :user
end
