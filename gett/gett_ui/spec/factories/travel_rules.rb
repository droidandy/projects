FactoryGirl.define do
  factory :travel_rule_base, class: 'TravelRule' do
    name { Faker::Commerce.product_name }
  end

  factory :travel_rule, parent: :travel_rule_base do
    transient do
      members     { [create(:member, company: company)] }
      vehicles    { [] }
      departments { [] }
      work_roles  { [] }
    end

    company        { create :company }
    member_pks     { members.map(&:id) }
    vehicle_pks    { vehicles.map(&:id) }
    department_pks { departments.map(&:id) }
    work_role_pks  { work_roles.map(&:id) }

    trait :allow_unregistered do
      allow_unregistered true
    end
  end

  feature_factory :travel_rule, parent: :travel_rule_base do
    fetch_vehicles = -> { Vehicle.active.all.reject{ |v| v.fallback? || v.manual? }.sort_by(&:id).uniq(&:name) }
    days = %w(Monday Tuesday Wednesday Thursday Friday Saturday Sunday)

    allow_unregistered true

    transient do
      members     { [] }
      vehicles    { fetch_vehicles.call.map(&:name) }
      departments { [] }
      work_roles  { [] }
      week_days   { days.dup }
    end

    member_pks     { members.map(&:id) }
    department_pks { departments.map(&:id) }
    work_role_pks  { work_roles.map(&:id) }
    weekdays       { week_days.map{ |d| days.index(d) + 1 } }

    vehicle_pks do
      vehicle_ids = fetch_vehicles.call.map{ |v| [v.name, v.id] }.to_h
      vehicles.map{ |v| vehicle_ids[v] }
    end
  end
end
