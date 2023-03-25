FactoryGirl.define do
  factory :member_base, parent: :user, class: 'Member' do
    role { Role[:booker] }

    trait :inactive do
      active false
    end

    trait :onboarding do
      onboarding true
    end

    trait :with_all_notifications do
      notify_with_sms true
      notify_with_email true
      notify_with_push true
    end

    trait :with_sms_notifications do
      notify_with_sms true
    end

    trait :with_email_notifications do
      notify_with_email true
    end

    trait :with_push_notifications do
      notify_with_push true
    end

    trait :bbc_freelancer do
      pd_type { Member::BBC::PdType::FREELANCER }
    end

    trait :bbc_staff do
      pd_type { Member::BBC::PdType::STAFF }
    end

    trait :bbc_temp_pd do
      pd_type { Member::BBC::PdType::STAFF }
      wh_travel false
      pd_accepted_at nil
    end

    trait :bbc_thin_pd do
      pd_type { Member::BBC::PdType::STAFF }
      wh_travel false
      pd_accepted_at { 1.day.ago }
    end

    trait :bbc_full_pd do
      pd_type { Member::BBC::PdType::STAFF }
      wh_travel true
      pd_accepted_at { 1.day.ago }
      pd_expires_at { 1.year.from_now }
      hw_exemption_time_from '22:00'
      hw_exemption_time_to   '06:30'
      wh_exemption_time_from '22:45'
      wh_exemption_time_to   '06:30'
    end

    trait :pd_accepted do
      pd_accepted_at { Time.current }
      pd_expires_at { 1.year.from_now }
    end

    trait :pd_expired do
      pd_expires_at { 1.day.ago }
    end
  end

  factory :member, parent: :member_base, aliases: [:booker] do
    company { create(:company) }
    phone   { '+380995555555' }
    default_phone_type { Member::PhoneType::PHONE }

    factory :companyadmin do
      role { Role[:companyadmin] }
    end

    factory :admin do
      role { Role[:admin] }
    end

    factory :finance do
      role { Role[:finance] }
    end

    factory :travelmanager do
      role { Role[:travelmanager] }
    end

    factory :passenger do
      role { Role[:passenger] }
      payroll 'Test Payroll ID'
      cost_centre 'Test Cost Centre'
      division 'Test Division'

      after(:build) do |record|
        record.pd_type ||= Member::BBC::PdType::FREELANCER if record.company&.bbc?
      end
    end
  end

  feature_factory :member, parent: :member_base, aliases: [:feature_booker] do
    phone { Faker::PhoneNumber.phone_number(:gb) }
    password 'P@ssword'
    password_confirmation 'P@ssword'
    notify_with_sms true
    notify_with_email true
    notify_with_push true

    transient do
      onboarding false
    end

    factory :feature_companyadmin do
      role { Role[:companyadmin] }
    end

    factory :feature_admin do
      role { Role[:admin] }
    end

    factory :feature_passenger do
      role { Role[:passenger] }
      after :create do |record|
        create(:passenger_address, :work, passenger: record, address: record.company.address)
      end
    end

    factory :feature_finance do
      role { Role[:finance] }
    end

    factory :feature_travelmanager do
      role { Role[:travelmanager] }
    end

    trait :with_personal_payment_card do
      after :create do |record|
        create(:payment_card, :personal, passenger: record)
      end
    end

    trait :with_business_payment_card do
      after :create do |record|
        create(:payment_card, :business, passenger: record)
      end
    end

    trait :with_payment_cards do
      after :create do |record|
        create(:payment_card, :personal, passenger: record)
        create(:payment_card, :business, passenger: record)
      end
    end

    trait :with_home_address do
      after :create do |record|
        address = create(:address, :baker_street)
        create(:passenger_address, :home, passenger: record, address: address)
      end
    end

    trait :with_work_address do
      after :create do |record|
        create(:passenger_address, :work, passenger: record, address: record.company.address)
      end
    end

    trait :with_home_address_more_40_miles do
      after :create do |record|
        address = create(:address, :mercedes_glasgow)
        record.update(home_address: address)
      end
    end

    trait :bbc_temp_pd do
      pd_type { Member::BBC::PdType::STAFF }
      wh_travel false
      pd_expires_at { Date.current + 29.days }
    end

    trait :bbc_thin_pd do
      pd_type { Member::BBC::PdType::STAFF }
      wh_travel false
      pd_accepted_at { 1.day.ago }
      pd_expires_at { 1.year.from_now }
    end

    trait :bbc_full_pd do
      with_home_address
      pd_type { Member::BBC::PdType::STAFF }
      wh_travel true
      pd_accepted_at { 1.day.ago }
      pd_expires_at { 1.year.from_now }
      hw_exemption_time_from '22:00'
      hw_exemption_time_to   '06:30'
      wh_exemption_time_from '22:45'
      wh_exemption_time_to   '06:30'
    end

    trait :inside_lnemt do
      hw_exemption_time_from { (Time.now - 1.hour).utc.in_time_zone("Europe/London").strftime('%H:%M') }
      hw_exemption_time_to   { (Time.now + 1.hour).utc.in_time_zone("Europe/London").strftime('%H:%M') }
      wh_exemption_time_from { (Time.now - 1.hour).utc.in_time_zone("Europe/London").strftime('%H:%M') }
      wh_exemption_time_to   { (Time.now + 1.hour).utc.in_time_zone("Europe/London").strftime('%H:%M') }
    end

    trait :outside_lnemt do
      hw_exemption_time_from { (Time.now + 1.hour).utc.in_time_zone("Europe/London").strftime('%H:%M') }
      hw_exemption_time_to   { (Time.now + 2.hours).utc.in_time_zone("Europe/London").strftime('%H:%M') }
      wh_exemption_time_from { (Time.now + 1.hour).utc.in_time_zone("Europe/London").strftime('%H:%M') }
      wh_exemption_time_to   { (Time.now + 2.hours).utc.in_time_zone("Europe/London").strftime('%H:%M') }
    end

    before :create do |record, factory|
      if factory.onboarding
        record.password = nil
        record.password_confirmation = nil
      end
    end

    after :create do |record, factory|
      record.set_reset_password_token! if factory.onboarding
    end
  end
end
