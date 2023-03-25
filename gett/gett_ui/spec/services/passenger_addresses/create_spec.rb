require 'rails_helper'

RSpec.describe PassengerAddresses::Create, type: :service do
  it { is_expected.to be_authorized_by(Passengers::UpdatePolicy) }

  describe '#execute' do
    let(:company)   { create(:company) }
    let(:admin)     { create(:admin, company: company) }
    let(:passenger) { create(:passenger, company: company) }

    service_context { { member: admin, company: company } }

    subject(:service) { described_class.new(params: params, passenger: passenger) }

    context 'with valid params' do
      let(:params) do
        {
          name: 'address',
          type: 'favorite',
          address: { line: 'foo', lat: '1.0', lng: '2.0', country_code: 'GB', city: 'London' }
        }
      end

      it 'creates new PassengerAddress' do
        expect{ service.execute }.to change(PassengerAddress, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:passenger_address) { is_expected.to be_persisted }
        its('passenger_address.name') { is_expected.to eq 'address' }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '', type: 'favorite', address: {line: 'foo'} } }

      it 'does not create new PassengerAddress' do
        expect{ service.execute }.not_to change(PassengerAddress, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to be_present }
      end
    end
  end
end
