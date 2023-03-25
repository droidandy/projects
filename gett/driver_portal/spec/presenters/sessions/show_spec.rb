require 'rails_helper'

RSpec.describe Sessions::Show do
  let(:user) { create(:user) }
  let(:session) { double('Session', access_token: 'token', user: user) }

  subject { described_class.new(session) }

  USER_FIELDS = %i(
    id
    email
    first_name
    last_name
    created_at
    updated_at
    address
    city
    is_frozen
    approval_status
    onboarding_step
    insurance_number_agreement
    documents_agreement
    appointment_scheduled
    documents_uploaded
    active
    roles
    permissions
  ).freeze

  describe '#as_json' do
    it 'returns access token and user' do
      json = subject.as_json
      expect(json[:access_token]).to eq('token')
      expect(json[:user].keys).to eq(USER_FIELDS)
    end
  end
end
