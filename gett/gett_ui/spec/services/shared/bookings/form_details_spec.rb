require 'rails_helper'

RSpec.describe Shared::Bookings::FormDetails, type: :service do
  let(:company) { create(:company) }

  let(:service) do
    Shared::Bookings::FormDetails.new(
      company: company,
      data_params: data_params,
      booking_params: booking_params,
      include_vehicle_vendor_options: true
    )
  end

  let(:data_params)    { {} }
  let(:booking_params) { {} }

  describe '#execute' do
    context 'when vehicles are requested' do
      let(:data_params) { {request_vehicles: true} }
      let(:booking_params) do
        {
          passenger_name: 'Petr Ivanov',
          passenger_phone: '+79998886655',
          scheduled_at: '2017-05-11T19:42:06+00:00',
          scheduled_type: 'now',
          pickup_address: {postal_code: 'NW11 9UA', lat: '51.5766877', lng: '-0.2156368', line: 'Pickup', country_code: 'GB'},
          destination_address: {postal_code: 'HA8 6EY', lat: '51.6069082', lng: '-0.2816665', line: 'Setdown', country_code: 'GB'},
          stops: [{
            name: 'Petr',
            phone: '+79998886655',
            address: {postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point', country_code: 'GB'}
          }]
        }
      end

      let(:vehicles) { [available: true, name: 'vehicle_name'] }
      let(:service_double) { double(result: {vehicles: vehicles}) }

      it 'delegates to ::Bookings::Vehicles service' do
        expect(::Bookings::Vehicles).to receive(:new)
          .with(company: company, params: booking_params, with_manual: false).and_return(service_double)
        expect(service_double).to receive(:execute).and_return(service_double)

        expect(service.execute).to be_success
        expect(service.result[:vehicles_data]).to eq(service_double.result)
        expect(service.result[:attrs][:vehicle]).to eq(name: 'vehicle_name')
      end
    end

    describe ':special_requirement_options' do
      subject { service.execute.result[:special_requirement_options] }

      let(:current_vehicle) { double(service_type: :ot, ot?: true) }
      let(:special_requirements_result) do
        [
          { key: '001', label: 'Label 1' },
          { key: '002', label: 'Label 2' }
        ]
      end

      before do
        allow(service).to receive(:current_vehicle).and_return(current_vehicle)
        allow(company).to receive(:special_requirements_for)
          .with(current_vehicle.service_type)
          .and_return(special_requirements_result)
      end

      it { is_expected.to eq(special_requirements_result) }
    end

    describe ':vehicle_vendor_options' do
      before { allow(service).to receive(:current_vehicle).and_return(current_vehicle) }

      subject { service.execute.result[:vehicle_vendor_options] }

      context 'when there is no current vehicle' do
        let(:current_vehicle) { nil }

        it { is_expected.to eq([]) }
      end

      context 'when current_vehicle is not OT' do
        let(:current_vehicle) { double(service_type: :gett, ot?: false) }

        it { is_expected.to eq([]) }
      end

      context 'when current_vehicle is not OT' do
        let(:ven1)       { create(:vehicle_vendor, key: 'ven1', name: 'London Taxi', city: 'london') }
        let(:ven2)       { create(:vehicle_vendor, key: 'ven2', name: 'Oxford Taxi', city: 'oxford') }
        let(:ven3)       { create(:vehicle_vendor, key: 'ven3', name: 'Cambridge Taxi', city: 'cambridge') }
        let(:ven4) do
          create(:vehicle_vendor,
            key: 'ven4',
            name: 'Also London Taxi',
            city: 'some_city_near_london',
            postcode_prefixes: ['ZIP']
          )
        end
        let(:vendor_ids) { [ven1, ven2, ven3, ven4].pluck(:id) }
        let(:vehicle)    { create(:vehicle, :one_transport, vehicle_vendor_pks: vendor_ids) }
        let(:current_vehicle) { Bookings::Vehicle.new(service_type: 'ot', vehicle_ids: [vehicle.id]) }

        let(:booking_params) do
          {
            scheduled_at: '2018-04-29',
            pickup_address: {city: 'london', postal_code: 'ZIP'},
            destination_address: {city: 'oxford'}
          }
        end

        let(:result) do
          [
            {id: ven1.id, name: 'London Taxi'},
            {id: ven2.id, name: 'Oxford Taxi'},
            {id: ven4.id, name: 'Also London Taxi'}
          ]
        end

        it { is_expected.to match_array(result) }

        describe ':vehicle_vendor_id attr' do
          subject { service.execute.result[:attrs] }

          context 'when selected is present in available options' do
            let(:booking_params) { super().merge(vehicle_vendor_id: ven1.id) }

            it { is_expected.not_to have_key(:vehicle_vendor_id) }
          end

          context 'when selected id is not present in available options' do
            let(:booking_params) { super().merge(vehicle_vendor_id: ven3.id) }

            it { is_expected.to have_key(:vehicle_vendor_id) }
            its([:vehicle_vendor_id]) { is_expected.to eq('') }
          end
        end
      end
    end
  end
end
