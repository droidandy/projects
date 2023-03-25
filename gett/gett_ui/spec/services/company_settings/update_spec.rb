require 'rails_helper'

RSpec.describe CompanySettings::Update, type: :service do
  let(:company)          { create(:company) }
  let!(:primary_contact) { create(:contact, company_id: company.id) }
  let!(:billing_contact) { create(:contact, :billing, company_id: company.id) }

  it { is_expected.to be_authorized_by(CompanySettings::UpdatePolicy) }

  let(:params) do
    {
      address: {
        line: 'new primary address',
        lat: 1,
        lng: 2,
        country_code: 'GB',
        city: 'London'
      },
      primary_contact: {
        phone:      'new primary phone',
        mobile:     'new primary mobile',
        fax:        'new primary fax',
        email:      'new primary email',
        first_name: 'new primary first name',
        last_name:  'new primary last name'
      },
      billing_contact: {
        phone:      'new billing phone',
        mobile:     'new billing mobile',
        fax:        'new billing fax',
        email:      'new billing email',
        first_name: 'new billing first name',
        last_name:  'new billing last name',
        address: {
          line: 'new billing address',
          lat: 2,
          lng: 1,
          country_code: 'GB',
          city: 'London'
        }
      }
    }
  end

  subject(:service) { CompanySettings::Update.new(params: params) }

  describe '#execute' do
    service_context { { company: company } }

    before do
      company.reload
      service.execute
    end

    it { is_expected.to be_success }

    describe 'updated records' do
      subject { company }

      its('company_info.address.line')    { is_expected.to eq 'new primary address' }

      its('primary_contact.phone')        { is_expected.to eq 'new primary phone' }
      its('primary_contact.mobile')       { is_expected.to eq 'new primary mobile' }
      its('primary_contact.fax')          { is_expected.to eq 'new primary fax' }
      its('primary_contact.email')        { is_expected.to eq 'new primary email' }
      its('primary_contact.first_name')   { is_expected.to eq 'new primary first name' }
      its('primary_contact.last_name')    { is_expected.to eq 'new primary last name' }

      its('billing_contact.phone')        { is_expected.to eq 'new billing phone' }
      its('billing_contact.mobile')       { is_expected.to eq 'new billing mobile' }
      its('billing_contact.fax')          { is_expected.to eq 'new billing fax' }
      its('billing_contact.email')        { is_expected.to eq 'new billing email' }
      its('billing_contact.first_name')   { is_expected.to eq 'new billing first name' }
      its('billing_contact.last_name')    { is_expected.to eq 'new billing last name' }
      its('billing_contact.address.line') { is_expected.to eq 'new billing address' }
    end
  end
end
