require 'rails_helper'

RSpec.describe Locations::Update, type: :service do
  it { is_expected.to be_authorized_by(Locations::Policy) }

  describe '#execute' do
    let(:company)      { create(:company) }
    let(:companyadmin) { create(:companyadmin, company: company) }
    let(:location)     { create(:location, company: company) }

    subject(:service) { described_class.new(location: location, params: params) }

    service_context { { member: companyadmin, company: company } }

    context 'with valid params' do
      let(:params) do
        {
          name: 'new name',
          address: {
            line: 'line',
            lat: 0,
            lng: 0,
            postal_code: 'postal_code',
            country_code: 'country_code',
            city: 'city'
          }
        }
      end

      it 'updates Location' do
        expect{ service.execute }.to change{ location.reload.name }.to('new name')
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:location) { is_expected.to be_persisted }
        its('location.address.line') { is_expected.to eq 'line' }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not update Location' do
        expect{ service.execute }.not_to change{ location.reload.name }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
