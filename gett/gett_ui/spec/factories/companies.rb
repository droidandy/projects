FactoryGirl.define do
  sequence(:company_name){ |n| "Company#{n}" }

  factory :company_base, class: 'Company' do
    fake false
    booker_notifications false
    booker_notifications_emails nil
    api_notifications_enabled true
    ddi

    trait :inactive do
      active false
    end

    trait :enterprise do
      company_type 'enterprise'
    end

    trait :bbc do
      company_type 'bbc'
      custom_attributes do
        {
          travel_policy_mileage_limit: '40',
          excess_cost_per_mile: '1.8',
          p11d: '50'
        }
      end
    end

    trait :critical do
      critical_flag_due_on Date.current.tomorrow
    end

    trait :with_linked_company do
      before(:create) do |company|
        company.linked_company_pks << create(:company).id
      end
    end

    transient do
      address_id nil
      legal_address_id nil
      salesman_id nil
      account_manager_id nil
      default_payment_type 'account'
      phone_booking_fee 1.0
      international_booking_fee 0
      system_fx_rate_increase_percentage 0
      cancellation_before_arrival_fee 0
      cancellation_after_arrival_fee 0
      gett_cancellation_before_arrival_fee 0
      gett_cancellation_after_arrival_fee 0
      get_e_cancellation_before_arrival_fee 0
      get_e_cancellation_after_arrival_fee 0
      splyt_cancellation_before_arrival_fee 0
      splyt_cancellation_after_arrival_fee 0
      carey_cancellation_before_arrival_fee 0
      carey_cancellation_after_arrival_fee 0
      additional_billing_recipients nil
      quote_price_increase_percentage 0
      quote_price_increase_pounds 0
      country_code 'GB'
    end
  end

  factory :company, parent: :company_base do
    gett_business_id 'TestBusinessId'
    ot_username 'TestUsername'
    ot_client_number 'TestNumber'
    default_driver_message 'Test Message'

    transient do
      name { generate :company_name }
      run_in_fee nil
      booking_fee nil
      handling_fee nil
      tips nil
      payment_types ['account']
      invoicing_schedule 'weekly'
      payment_terms 7
    end

    trait :affiliate do
      company_type 'affiliate'
    end

    trait :fake do
      fake true
    end

    trait :real do
      fake false
    end

    trait :with_contact do
      after(:create) do |company|
        create(:contact, company_id: company.id)
      end
    end

    trait :credit_rate_na do
      credit_rate_status { Company::CreditRateStatus::NA }
    end

    trait :credit_rate_ok do
      credit_rate_status { Company::CreditRateStatus::OK }
    end

    trait :credit_rate_bad_credit do
      credit_rate_status { Company::CreditRateStatus::BAD_CREDIT }
    end

    trait :credit_rate_bankruptcy do
      credit_rate_status { Company::CreditRateStatus::BANKRUPTCY }
    end

    trait :credit_rate_liquidation do
      credit_rate_status { Company::CreditRateStatus::LIQUIDATION }
    end

    trait :credit_rate_ccj do
      credit_rate_status { Company::CreditRateStatus::CCJ }
    end

    trait :credit_rate_unable_to_check do
      credit_rate_status { Company::CreditRateStatus::UNABLE_TO_CHECK }
    end

    after :create do |company, factory|
      create(:company_info,
        company: company,
        name: factory.name,
        run_in_fee: factory.run_in_fee,
        booking_fee: factory.booking_fee,
        handling_fee: factory.handling_fee,
        address_id: factory.address_id,
        legal_address_id: factory.legal_address_id,
        salesman_id: factory.salesman_id,
        account_manager_id: factory.account_manager_id,
        tips: factory.tips,
        phone_booking_fee: factory.phone_booking_fee,
        international_booking_fee: factory.international_booking_fee,
        system_fx_rate_increase_percentage: factory.system_fx_rate_increase_percentage,
        cancellation_before_arrival_fee: factory.cancellation_before_arrival_fee,
        cancellation_after_arrival_fee: factory.cancellation_after_arrival_fee,
        gett_cancellation_before_arrival_fee: factory.gett_cancellation_before_arrival_fee,
        gett_cancellation_after_arrival_fee: factory.gett_cancellation_after_arrival_fee,
        get_e_cancellation_before_arrival_fee: factory.get_e_cancellation_before_arrival_fee,
        get_e_cancellation_after_arrival_fee: factory.get_e_cancellation_after_arrival_fee,
        splyt_cancellation_before_arrival_fee: factory.splyt_cancellation_before_arrival_fee,
        splyt_cancellation_after_arrival_fee: factory.splyt_cancellation_after_arrival_fee,
        carey_cancellation_before_arrival_fee: factory.carey_cancellation_before_arrival_fee,
        carey_cancellation_after_arrival_fee: factory.carey_cancellation_after_arrival_fee,
        quote_price_increase_percentage: factory.quote_price_increase_percentage,
        quote_price_increase_pounds: factory.quote_price_increase_pounds,
        country_code: factory.country_code
      )
      create(:payment_options,
        company_id: company.id,
        payment_types: factory.payment_types,
        default_payment_type: factory.default_payment_type,
        invoicing_schedule: factory.invoicing_schedule,
        payment_terms: factory.payment_terms,
        additional_billing_recipients: factory.additional_billing_recipients
      )
    end
  end

  feature_factory :company, parent: :company_base do
    active true
    destination_required false
    booking_reference_required false
    booking_reference_validation false
    gett_business_id 'UK-3836'
    ot_username 'Demo_admin'
    ot_client_number 'D25'
    default_driver_message ''
    multiple_booking false
    payroll_required false
    cost_centre_required false
    customer_care_password nil
    hr_feed_enabled false
    marketing_allowed false
    allow_preferred_vendor false
    bookings_validation_enabled false
    api_enabled false
    sap_id nil

    transient do
      name { Faker::Company.name }
      legal_name nil
      vat_number nil
      account_number nil
      sort_code nil
      cost_centre nil
      contact_id nil
      run_in_fee 1.0
      booking_fee 1.5
      handling_fee 20.0
      tips 10
      payment_types %w[account passenger_payment_card cash]
      invoicing_schedule 'monthly'
      payment_terms 30
      onboarding false
      admin_phone { Faker::PhoneNumber.phone_number(:gb) }
    end

    trait :affiliate do
      company_type 'affiliate'
      gett_business_id 'UK-3613'
      ot_username nil
      ot_client_number nil
    end

    trait :company_payment_card do
      payment_types %w[company_payment_card]
      default_payment_type 'company_payment_card'
      with_payment_card
    end

    trait :account do
      payment_types %w[account]
      default_payment_type 'account'
    end

    trait :passenger_payment_card_periodic do
      payment_types %w[passenger_payment_card_periodic]
      default_payment_type 'passenger_payment_card_periodic'
    end

    trait :passenger_payment_card do
      payment_types %w[passenger_payment_card]
      default_payment_type 'passenger_payment_card'
    end

    trait :with_payment_card do
      after :create do |company|
        create(:payment_card, :company, company: company)
      end
    end

    after :create do |company, factory|
      def default_company_address
        Address.find_or_create(
          line: '167 Fleet St, London EC4A 2EA, UK',
          lat: '51.5141693',
          lng: '-0.1088909',
          postal_code: 'EC4A 2EA',
          country_code: 'GB',
          city: 'London',
          region: 'England'
        )
      end
      create(:company_info,
        company: company,
        name: factory.name,
        legal_name: factory.legal_name,
        vat_number: factory.vat_number,
        cost_centre: factory.cost_centre,
        run_in_fee: company.enterprise? ? factory.run_in_fee : 1.0,
        booking_fee: company.enterprise? ? factory.booking_fee : 1.5,
        handling_fee: company.enterprise? ? factory.handling_fee : 20,
        address_id: factory.address_id ? factory.address_id : default_company_address.id,
        legal_address_id: factory.legal_address_id,
        salesman_id: factory.salesman_id,
        contact_id: factory.contact_id,
        tips: company.enterprise? ? factory.tips : nil,
        phone_booking_fee: company.enterprise? ? factory.phone_booking_fee : 1.0,
        cancellation_before_arrival_fee: company.enterprise? ? factory.cancellation_before_arrival_fee : 0,
        cancellation_after_arrival_fee: company.enterprise? ? factory.cancellation_after_arrival_fee : 0,
        gett_cancellation_before_arrival_fee: company.enterprise? ? factory.gett_cancellation_before_arrival_fee : 0,
        gett_cancellation_after_arrival_fee: company.enterprise? ? factory.gett_cancellation_after_arrival_fee : 0,
        get_e_cancellation_before_arrival_fee: company.enterprise? ? factory.get_e_cancellation_before_arrival_fee : 0,
        get_e_cancellation_after_arrival_fee: company.enterprise? ? factory.get_e_cancellation_after_arrival_fee : 0,
        splyt_cancellation_before_arrival_fee: company.enterprise? ? factory.splyt_cancellation_before_arrival_fee : 0,
        splyt_cancellation_after_arrival_fee: company.enterprise? ? factory.splyt_cancellation_after_arrival_fee : 0,
        carey_cancellation_before_arrival_fee: company.enterprise? ? factory.carey_cancellation_before_arrival_fee : 0,
        carey_cancellation_after_arrival_fee: company.enterprise? ? factory.carey_cancellation_after_arrival_fee : 0,
        quote_price_increase_percentage: factory.quote_price_increase_percentage,
        quote_price_increase_pounds: factory.quote_price_increase_pounds,
        account_number: company.enterprise? ? nil : factory.account_number,
        sort_code: company.enterprise? ? nil : factory.sort_code
      )
      create(:payment_options,
        company_id: company.id,
        payment_types: company.enterprise? ? factory.payment_types : ['cash'],
        default_payment_type: company.enterprise? ? factory.default_payment_type : 'cash',
        invoicing_schedule: company.enterprise? ? factory.invoicing_schedule : 'monthly',
        payment_terms: company.enterprise? ? factory.payment_terms : 30
      )

      admin = create(:companyadmin, onboarding: factory.onboarding, company: company, phone: factory.admin_phone)
      ApiKey.create(user: admin) if factory.api_enabled

      unless factory.contact_id
        create(:contact,
          company_id: company.id,
          phone: company.admin.phone,
          mobile: nil,
          fax: nil,
          email: company.admin.email,
          first_name: company.admin.first_name,
          last_name:  company.admin.last_name,
          address_id: company.reload.address.id
        )
      end
      company.reload
    end
  end
end
