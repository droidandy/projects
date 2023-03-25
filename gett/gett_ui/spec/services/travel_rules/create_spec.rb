require 'rails_helper'

RSpec.describe TravelRules::Create, type: :service do
  it { is_expected.to be_authorized_by(TravelRules::CreatePolicy) }

  describe '#execute' do
    let(:company)       { create :company }
    let!(:companyadmin) { create :companyadmin, company: company }
    let(:users)         { create_list :member, 3, company: company }
    let!(:gett_vehicle) { create :vehicle, :gett }
    let!(:ot_vehicle)   { create :vehicle, :one_transport }

    service_context { { member: companyadmin, company: company } }

    subject(:service) { described_class.new(params: params) }

    context 'with valid params' do
      let(:params) do
        {
          priority: 1,
          name: 'New rule',
          min_distance: 1,
          max_distance: 5,
          min_time: Time.current,
          max_time: Time.current + 3.hours,
          location: 'GreaterLondon',
          weekdays: [6, 7],
          member_pks: users.map(&:id),
          vehicle_pks: [gett_vehicle.id, ot_vehicle.id],
          cheapest: true
        }
      end

      it 'creates new travel rule' do
        expect{ service.execute }.to change(TravelRule, :count).by(1)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.to be_success }
        its(:travel_rule) { is_expected.to be_persisted }
        its('travel_rule.location') { is_expected.to eq 'GreaterLondon' }
        its('travel_rule.cheapest') { is_expected.to be true }
        its('travel_rule.vehicles.length') { is_expected.not_to eq 0 }
        its(:errors) { is_expected.to be_blank }
      end
    end

    context 'with invalid params' do
      let(:params) do
        {
          priority: 1,
          min_distance: 1,
          max_distance: 5,
          min_time: Time.current,
          max_time: Time.current + 3.hours,
          location: 'CentralLondon',
          weekdays: [6, 7],
          member_pks: users.map(&:id),
          vehicle_pks: [gett_vehicle.id]
        }
      end

      it 'does not create new Travel Rule' do
        expect{ service.execute }.not_to change(TravelRule, :count)
      end

      describe 'execution results' do
        before { service.execute }

        it { is_expected.not_to be_success }
        its(:errors) { is_expected.not_to be_empty }
      end
    end
  end
end
