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

FactoryBot.define do
  factory :documents_field, class: 'Documents::Field' do
    association :kind, factory: :documents_kind
    sequence(:label) { |n| "Label #{n}" }
    sequence(:name) { |n| "Name #{n}" }
    field_type :str
    mandatory false
  end
end
