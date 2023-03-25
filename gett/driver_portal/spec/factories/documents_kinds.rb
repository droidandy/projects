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

FactoryBot.define do
  factory :documents_kind, class: 'Documents::Kind' do
    sequence(:title) { |n| "Doc Kind ##{n}" }
    sequence(:slug) { |n| "doc_kind_#{n}" }
    mandatory false
    owner :driver

    factory :required_documents_kind do
      mandatory true
    end
  end
end
