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

require 'rails_helper'

RSpec.describe User do
  subject { described_class }

  let(:user) { create :user }

  it 'has paper trail' do
    user.update email: 'new@email.com'
    expect(user.versions.count).to eq(2)
  end

  it 'does not track some attributes changes' do
    user.update account_number: '12345678'
    expect(user.versions.count).to eq(1)
  end
end
