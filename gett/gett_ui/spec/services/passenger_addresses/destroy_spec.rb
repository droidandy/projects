require 'rails_helper'

RSpec.describe PassengerAddresses::Destroy, type: :service do
  let(:company)   { create :company }
  let(:admin)     { create :admin, company: company }
  let(:passenger) { create :passenger, company: company }
  let(:booker)    { create :booker, company: company }
  let!(:paddress) { create :passenger_address, passenger: passenger }
  let(:service)   { PassengerAddresses::Destroy.new(passenger_address: paddress) }

  it { is_expected.to be_authorized_by(Passengers::UpdatePolicy) }

  shared_examples_for 'the one that destroys PassengerAddress successfully' do
    it 'destroys PassengerAddress' do
      expect{ service.execute }.to change(PassengerAddress, :count).by(-1)
    end

    it 'executes successfully' do
      expect(service.execute).to be_success
    end
  end

  context 'when user is a admin' do
    service_context { { member: admin } }

    it_behaves_like 'the one that destroys PassengerAddress successfully'
  end

  context 'when user is a passenger' do
    service_context { { member: paddress.passenger } }

    it_behaves_like 'the one that destroys PassengerAddress successfully'
  end

  context 'when user is a booker' do
    service_context { { member: booker } }

    it_behaves_like 'the one that destroys PassengerAddress successfully'
  end
end
