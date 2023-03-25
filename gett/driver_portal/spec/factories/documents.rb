# == Schema Information
#
# Table name: documents
#
#  id              :bigint(8)        not null, primary key
#  user_id         :bigint(8)
#  kind_id         :bigint(8)
#  file            :string
#  hidden          :boolean          default(FALSE)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  vehicle_id      :bigint(8)
#  content_type    :string
#  file_name       :string
#  metadata        :jsonb            not null
#  approval_status :integer          default("pending"), not null
#  expires_at      :datetime
#  agent_id        :bigint(8)
#  gett_id         :integer
#  started_at      :datetime
#  unique_id       :string
#

FactoryBot.define do
  factory :document do
    user
    association :kind, factory: :documents_kind
    expires_at { Time.zone.today + 1.year }
    file { File.open(Rails.root.join('spec', 'samples', 'files', 'pdf-sample.pdf')) }
    content_type 'application/pdf'
    file_name 'pdf-sample.pdf'

    trait :with_metadata do
      metadata { { string: 'Qwer', date: '2018-01-02', bool: true } }
    end

    trait :required do
      association :kind, factory: :required_documents_kind
    end

    trait :vehicle_bound do
      association :kind, factory: :documents_kind, owner: :vehicle
      vehicle
    end

    trait :agent_uploaded do
      agent
    end

    trait :approved do
      approval_status :approved
    end

    trait :rejected do
      approval_status :rejected
    end
  end
end
