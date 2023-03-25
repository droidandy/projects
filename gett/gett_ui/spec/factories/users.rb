FactoryGirl.define do
  factory :user_base, class: 'User' do
    email { Faker::Internet.email }
    first_name { Faker::Name.first_name }
    last_name  { Faker::Name.last_name }

    trait :with_password_reset do
      reset_password_token   { SecureRandom.hex(10) }
      reset_password_sent_at { Time.current }
    end

    trait :admin do
      user_role { Role.find_or_create(name: 'admin') }
    end

    trait :superadmin do
      user_role { Role.find_or_create(name: 'superadmin') }
    end

    trait :sales do
      user_role { Role.find_or_create(name: 'sales') }
    end

    trait :customer_care do
      user_role { Role.find_or_create(name: 'customer_care') }
    end

    trait :outsourced_customer_care do
      user_role { Role.find_or_create(name: 'outsourced_customer_care') }
    end

    factory :user, parent: :user_base do
      password_digest '12345678'
    end

    factory :feature_user, parent: :user_base do
      password 'P@ssword'
      password_confirmation 'P@ssword'
    end
  end
end
