require 'rails_helper'

RSpec.describe CompanySettings::Show, type: :service do
  let(:company_address)  { create :address }
  let(:company)          { create :company, address_id: company_address.id }
  let(:admin)            { create :admin, company: company }
  let!(:primary_contact) { create :contact, company_id: company.id }
  let!(:billing_contact) { create :contact, :billing, company_id: company.id }

  it { is_expected.to be_authorized_by(CompanySettings::ShowPolicy) }

  subject(:service) { CompanySettings::Show.new }

  describe '#execute' do
    service_context { { member: admin, company: company } }

    before do
      company.reload
      service.execute
    end

    it { is_expected.to be_success }

    describe 'result' do
      subject { service.result }

      its([:data, :address, 'line']) { is_expected.to eq company_address.line }
      its([:data, :address, 'lat'])  { is_expected.to eq company_address.lat }
      its([:data, :address, 'lng'])  { is_expected.to eq company_address.lng }

      its([:data, :primary_contact, 'phone'])           { is_expected.to eq primary_contact.phone }
      its([:data, :primary_contact, 'mobile'])          { is_expected.to eq primary_contact.mobile }
      its([:data, :primary_contact, 'fax'])             { is_expected.to eq primary_contact.fax }
      its([:data, :primary_contact, 'email'])           { is_expected.to eq primary_contact.email }
      its([:data, :primary_contact, 'first_name'])      { is_expected.to eq primary_contact.first_name }
      its([:data, :primary_contact, 'last_name'])       { is_expected.to eq primary_contact.last_name }

      its([:data, :billing_contact, 'phone'])           { is_expected.to eq billing_contact.phone }
      its([:data, :billing_contact, 'mobile'])          { is_expected.to eq billing_contact.mobile }
      its([:data, :billing_contact, 'fax'])             { is_expected.to eq billing_contact.fax }
      its([:data, :billing_contact, 'email'])           { is_expected.to eq billing_contact.email }
      its([:data, :billing_contact, 'first_name'])      { is_expected.to eq billing_contact.first_name }
      its([:data, :billing_contact, 'last_name'])       { is_expected.to eq billing_contact.last_name }
      its([:data, :billing_contact, 'address', 'line']) { is_expected.to eq billing_contact.address.line }
      its([:data, :billing_contact, 'address', 'lat'])  { is_expected.to eq billing_contact.address.lat }
      its([:data, :billing_contact, 'address', 'lng'])  { is_expected.to eq billing_contact.address.lng }

      its([:can, :edit]) { is_expected.to be true }
    end
  end
end
