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

FactoryBot.define do
  factory :vehicle do
    user
    sequence(:title) { |n| "Vehicle ##{n}" }
    color 'Black'
    model 'Lada Ellada'
    plate_number 'F00 BAR'
  end
end
