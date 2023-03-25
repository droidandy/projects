# == Schema Information
#
# Table name: invites
#
#  id           :bigint(8)        not null, primary key
#  user_id      :bigint(8)
#  sender_id    :bigint(8)
#  accepted_at  :datetime
#  expires_at   :datetime
#  token_digest :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  step         :integer          default("info"), not null
#

FactoryBot.define do
  factory :invite do
    token_digest { Digest::SHA256.hexdigest(SecureRandom.urlsafe_base64) }

    association :user, factory: :user
    association :sender, factory: :user

    trait :expired do
      expires_at { Time.current }
    end

    trait :accepted do
      step :accepted
      accepted_at { Time.current }
    end
  end
end
