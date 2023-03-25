require 'rails_helper'

RSpec.describe PassengerAddresses::Update, type: :service do
  it { is_expected.to be_authorized_by(Passengers::UpdatePolicy) }

  describe '#execute' do
    let(:company)   { create(:company) }
    let(:admin)     { create(:admin, company: company) }
    let(:passenger) { create(:passenger, company: company) }
    let(:booker)    { create(:booker, company: company) }
    let(:paddress)  { create(:passenger_address, passenger: passenger) }

    subject(:service) { PassengerAddresses::Update.new(passenger_address: paddress, params: params) }

    context 'with valid params' do
      let(:params) do
        {
          name: 'new name',
          address: { line: 'foo', lat: '2.0', lng: '1.0', country_code: 'GB', city: 'London' }
        }
      end

      shared_examples_for 'the one that updates PassengerAddress successfully' do
        it 'updates PassengerAddress' do
          expect{ service.execute }.to change{ paddress.reload.name }.to('new name')
          expect(paddress.address).to have_attributes(
            line: 'foo',
            lat: 2.0,
            lng: 1.0,
            country_code: 'GB',
            city: 'London'
          )
        end

        describe 'execution results' do
          before { service.execute }

          it { is_expected.to be_success }
          its(:errors) { is_expected.to be_blank }
        end
      end

      context 'as admin' do
        service_context { { member: admin } }

        it_behaves_like 'the one that updates PassengerAddress successfully'
      end

      context 'as passenger' do
        service_context { { member: passenger } }

        it_behaves_like 'the one that updates PassengerAddress successfully'
      end

      context 'as booker' do
        service_context { { member: booker } }

        it_behaves_like 'the one that updates PassengerAddress successfully'
      end
    end

    context 'with invalid params' do
      let(:params) { { name: '', type: 'favorite' } }

      it 'does not update PassengerAddress' do
        expect{ service.execute }.not_to change{ paddress.reload.name }
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.to be_present }
      end
    end
  end
end
