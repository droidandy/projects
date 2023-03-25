FactoryBot.define do
  factory :review_update do
    review
    reviewer { create(:user, :with_site_admin_role) }
    requirement 'base'
    completed false
    comment 'comment'
  end
end
