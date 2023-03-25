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

FactoryBot.define do
  factory :statement do
    user
    sequence(:external_id) { |n| n }
    pdf { File.open(Rails.root.join('spec', 'samples', 'files', 'pdf-sample.pdf')) }
  end
end
