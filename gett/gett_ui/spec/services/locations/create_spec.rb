require 'rails_helper'

RSpec.describe Locations::Create, type: :service do
  it { is_expected.to be_authorized_by(Locations::Policy) }

  describe '#execute' do
    let!(:companyadmin) { create(:companyadmin) }

    service_context { { member: companyadmin, company: companyadmin.company } }

    subject(:service) { described_class.new(params: params) }

    context 'with valid params' do
      let(:params) do
        {
          name: 'Location',
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

      it 'creates new Location' do
        expect{ service.execute }.to change(Location, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:location) { is_expected.to be_persisted }
        its('location.name') { is_expected.to eq 'Location' }
        its('location.address.line') { is_expected.to eq 'line' }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '' } }

      it 'does not create new Location' do
        expect{ service.execute }.not_to change(Location, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
