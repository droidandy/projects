# == Schema Information
#
# Table name: users
#
#  id                         :bigint(8)        not null, primary key
#  email                      :string           not null
#  first_name                 :string
#  last_name                  :string
#  password_digest            :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  gett_id                    :integer
#  phone                      :string
#  address                    :string
#  city                       :string
#  postcode                   :string
#  account_number             :string
#  sort_code                  :string
#  badge_number               :string
#  vehicle_colour             :string
#  vehicle_type               :string
#  vehicle_reg                :string
#  reset_password_digest      :string
#  blocked_at                 :datetime
#  avatar                     :string
#  badge_type                 :string
#  license_number             :string
#  is_frozen                  :boolean          default(FALSE), not null
#  hobbies                    :string
#  talking_topics             :string
#  driving_cab_since          :date
#  disability_type            :string
#  disability_description     :string
#  birth_date                 :date
#  approval_status            :integer          default("documents_missing"), not null
#  approver_id                :bigint(8)
#  ready_for_approval_since   :datetime
#  how_did_you_hear_about     :string
#  onboarding_step            :integer          default(0), not null
#  onboarding_failed_at       :datetime
#  other_rating               :decimal(3, 2)
#  vehicle_reg_year           :integer
#  insurance_number           :string
#  insurance_number_agreement :boolean          default(FALSE), not null
#  documents_agreement        :boolean          default(FALSE), not null
#  appointment_scheduled      :boolean          default(FALSE), not null
#  documents_uploaded         :boolean          default(FALSE), not null
#  gett_phone                 :string
#  avatar_filename            :string
#  min_rides_number           :integer
#

FactoryBot.define do
  factory :user, aliases: [:author, :approver, :agent] do
    sequence(:email) { |n| "example_#{n}@fakemail.com" }
    first_name 'Frank'
    last_name 'Sinatra'
    password SecureRandom.hex
    password_confirmation { password }
    city 'City'
    address 'Address'

    trait :with_avatar do
      avatar File.open(Rails.root.join('spec', 'samples', 'files', "1x1.jpg"))
    end

    trait :blocked do
      blocked_at Time.current
    end

    trait :with_site_admin_role do
      after(:create) do |user|
        user.add_role(:site_admin)
      end
    end

    trait :with_community_manager_role do
      after(:create) do |user|
        user.add_role(:community_manager)
      end
    end

    trait :with_driver_support_role do
      after(:create) do |user|
        user.add_role(:driver_support)
      end
    end

    trait :with_system_admin_role do
      after(:create) do |user|
        user.add_role(:system_admin)
      end
    end

    trait :with_driver_role do
      sequence(:gett_id) { |n| n.to_i }
      after(:create) do |user|
        user.add_role(:driver)
      end
    end

    trait :with_apollo_driver_role do
      after(:create) do |user|
        user.add_role(:apollo_driver)
      end
    end

    trait :with_onboarding_agent_role do
      after(:create) do |user|
        user.add_role(:onboarding_agent)
      end
    end

    trait :with_accepted_invitation do
      after(:create) do |user|
        create :invite, :accepted, user: user
      end
    end

    trait :being_approved do
      approver
    end

    trait :system do
      email { Rails.application.secrets.system_user_email }
      after(:create) do |user|
        user.add_role(:system_admin)
      end
    end
  end
end
