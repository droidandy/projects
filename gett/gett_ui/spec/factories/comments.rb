FactoryGirl.define do
  factory :comment do
    author { create :user, :admin }
    text { Faker::Lorem.sentence }

    factory :booking_comment, class: 'BookingComment' do
      booking
    end

    factory :company_comment, class: 'CompanyComment' do
      company
    end

    factory :member_comment, class: 'MemberComment' do
      member
    end
  end
end
