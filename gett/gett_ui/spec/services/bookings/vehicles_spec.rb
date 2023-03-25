require 'rails_helper'

RSpec.describe Bookings::Vehicles, type: :service do
  before { Timecop.freeze('2018-01-01 12:00') }
  after  { Timecop.return }

  let(:company) { create(:company) }
  let(:params) do
    {
      pickup_address: {
        postal_code: 'NW11 9UA',
        lat: '51.5766877',
        lng: '-0.2156368',
        line: '3 Station Approach Highfield Avenue London',
        country_code: country_code,
        timezone: 'Europe/London',
        city: 'From City'
      },
      destination_address: {
        postal_code: 'HA8 6EY',
        lat: '51.6069082',
        lng: '-0.2816665',
        line: '1 Milford Gardens Edgware',
        country_code: country_code,
        city: 'To City'
      },
      scheduled_at: scheduled_at.to_s,
      passenger_name: 'Hosea Tillman', passenger_phone: '+7999888776655'
    }
  end
  let(:country_code) { 'GB' }
  let(:distance_response_result) do
    { distance: 100, duration: 110, distance_measure: 'miles', duration_measure: 'minutes' }
  end
  let(:distance_response) { double(execute: true, success?: true, result: distance_response_result) }
  let(:gett_response) { double(execute: true, can_execute?: true, as_vehicles: gett_vehicles) }
  let(:ot_response) { double(execute: true, can_execute?: true, as_vehicles: ot_vehicles) }
  let(:manual_response) { double(execute: true, can_execute?: true, as_vehicles: manual_vehicles) }
  let(:get_e_response) { double(execute: true, can_execute?: true, as_vehicles: get_e_vehicles) }
  let(:carey_response) { double(execute: true, can_execute?: true, as_vehicles: carey_vehicles) }
  let(:converter_service_stub) { double(execute: double(result: 15)) }

  let(:gett_vehicles) do
    [
      { value: gt_vehicle1.value, name: gt_vehicle1.name, eta: 1, price: 1000 },
      { value: gt_vehicle2.value, name: gt_vehicle2.name, eta: 5, price: 2000 }
    ]
  end
  let(:ot_vehicles) do
    [
      {
        value: ot_vehicle1.value,
        name: ot_vehicle1.name,
        price: 1000.0,
        quote_id: "quote1"
      },
      {
        value: ot_vehicle2.value,
        name: ot_vehicle2.name,
        price: 2000.0,
        quote_id: "quote1"
      }
    ]
  end

  let(:manual_vehicles) do
    [
      {
        value: sp_vehicle1.value,
        name: sp_vehicle1.name,
        price: 0,
        quote_id: "quote1"
      }
    ]
  end
  let(:get_e_vehicles) do
    [
      {
        value: get_e_vehicle1.value,
        name: get_e_vehicle1.name,
        price: 1000,
        quote_id: "quote1"
      }
    ]
  end

  let(:carey_vehicles) do
    [{
      value: carey_vehicle.value,
      name: carey_vehicle.name,
      price: 1000.0,
      quote_id: "quote1"
    }]
  end

  let(:distances) do
    { distance: 100, distance_measure: 'miles', duration_sec: 6600, duration_measure: 'minutes' }
  end
  let(:scheduled_at) { 10.minutes.from_now }

  let!(:gt_vehicle1) { create(:vehicle, :gett, name: 'gt_vehicle1', value: 'product1') }
  let!(:gt_vehicle2) { create(:vehicle, :gett, name: 'gt_vehicle2', value: 'product2') }
  let!(:ot_vehicle1) { create(:vehicle, :one_transport, name: 'ot_vehicle1', value: 'type1_class1', pre_eta: 25) }
  let!(:ot_vehicle2) { create(:vehicle, :one_transport, name: 'ot_vehicle2', value: 'type2_class2', earliest_available_in: 40) }
  let!(:sp_vehicle1) { create(:vehicle, :manual, name: 'sp_vehicle1', value: 'sp_vehicle1') }
  let!(:get_e_vehicle1) { create(:vehicle, :get_e, name: 'get_e_vehicle1', value: 'get_e_vehicle1') }
  let!(:get_e_vehicle2) { create(:vehicle, :get_e, name: 'get_e_vehicle1', value: 'get_e_vehicle2') }
  let!(:carey_vehicle) { create(:vehicle, :carey, name: 'carey_vehicle', value: 'carey1') }

  let(:allowed_services) { [:gett, :ot, :carey, :get_e, :manual] }

  subject(:service) { described_class.new(company: company, params: params) }

  before do
    # almost the same as default `Bookings::Vehicle.all`, but scoped only to vehicles created in spec
    allow(Bookings::Vehicle).to receive(:all).and_return(
      DB[:vehicle_products].where{ name.ilike('gt_vehicle%') | name.ilike('ot_vehicle%') | name.ilike('carey%') | name.ilike('sp_vehicle%') | name.ilike('get_e_vehicle%') }
        .all
        .sort_by{ |values| %w'gt_vehicle1 gt_vehicle2 ot_vehicle1 ot_vehicle2 carey_vehicle sp_vehicle1 get_e_vehicle1'.index(values[:name]) }
        .map{ |values| Bookings::Vehicle.new(values) }
    )

    allow(Bookings::TravelDistanceCalculator).to receive(:new).and_return(distance_response)
  end

  describe '#execute' do
    before do
      filter = double('Filter')
      allow(TravelRules::VehicleAvailability).to receive(:new).and_return(filter)
      allow(filter).to receive(:execute).and_yield(allowed_services)

      allow(Gett::Vehicles).to receive(:new).and_return(gett_response)
      allow(OneTransport::Vehicles).to receive(:new).and_return(ot_response)
      allow(Manual::Vehicles).to receive(:new).and_return(manual_response)
      allow(GetE::Vehicles).to receive(:new).and_return(get_e_response)
      allow(Carey::Vehicles).to receive(:new).and_return(carey_response)

      allow(Currencies::Converter).to receive(:new).and_return(converter_service_stub)
    end

    context 'when TravelRules allows to book all' do
      context 'when API services succeeds' do
        let(:is_via) { false }

        before do
          attrs = params.merge(
            scheduled_at: scheduled_at.to_datetime,
            later: true
          )
          expect(Gett::Vehicles).to receive(:new)
            .with(attrs: attrs, allowed_services: allowed_services, company: company)
            .and_return(gett_response)
          expect(OneTransport::Vehicles).to receive(:new)
            .with(attrs: attrs, allowed_services: allowed_services, company: company)
            .and_return(ot_response)
          expect(Manual::Vehicles).to receive(:new)
            .with(attrs: attrs, allowed_services: allowed_services, company: company)
            .and_return(manual_response)
          expect(GetE::Vehicles).to receive(:new)
            .with(attrs: attrs, allowed_services: allowed_services, company: company)
            .and_return(get_e_response)
          expect(Carey::Vehicles).to receive(:new)
            .with(attrs: attrs, allowed_services: allowed_services, company: company)
            .and_return(carey_response)
          allow(service).to receive(:via_provider?).and_return(is_via)
          service.execute
        end

        it { is_expected.to be_success }
        its(:result) do
          expected_vehicles = [
            { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 25", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000, quote_id: 'quote1', eta: "< 30", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
            { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
            { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
          ]

          is_expected.to eq(
            vehicles: expected_vehicles,
            booking_fee: nil,
            distance: '100 miles',
            duration: '110 minutes'
          )
        end

        context 'when Via vehicle is available' do
          let(:ot_vehicles) { [] }
          let(:get_e_vehicles) { [] }
          let(:carey_vehicles) { [] }
          let(:is_via) { true }

          it { is_expected.to be_success }
          it 'should return proper value of via field' do
            expected_gett_vehicles = [
              { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'via', description: '', details: [] },
              { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'via', description: '', details: [] }
            ]
            expect(service.result[:vehicles]).to include(*expected_gett_vehicles)
          end
        end

        context 'when distance less than 1 mile' do
          let(:distance_response_result) do
            { distance: 0.7, duration: 10, distance_measure: 'miles', duration_measure: 'minutes' }
          end

          its(:result) do
            expected_vehicles = [
              { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 25", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000, quote_id: 'quote1', eta: "< 30", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
              { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
              { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
            ]
            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '3696 feet',
              duration: '10 minutes'
            )
          end
        end

        context 'when pickup address is out of GB' do
          let(:country_code) { 'FR' }

          it { is_expected.to be_success }

          its(:result) do
            expected_vehicles = [
              { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 25", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000, quote_id: 'quote1', eta: "< 30", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [], local_price: 15, local_currency_symbol: '€' }
            ]

            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end

        context 'when system fx rate increase is applicable' do
          let(:company) { create(:company, system_fx_rate_increase_percentage: 50) }
          let(:country_code) { 'FR' }

          its(:result) do
            expected_vehicles = [
              { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1500, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 3000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1500, quote_id: 'quote1', eta: "< 25", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 3000, quote_id: 'quote1', eta: "< 30", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1500, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [], local_price: 15, local_currency_symbol: '€' },
              { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1500, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [], local_price: 15, local_currency_symbol: '€' }
            ]

            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end

        context 'when trader price is applicable' do
          let(:company) do
            create(:company,
              quote_price_increase_percentage: quote_price_increase_percentage,
              quote_price_increase_pounds: quote_price_increase_pounds
            )
          end
          let(:quote_price_increase_percentage) { 0 }
          let(:quote_price_increase_pounds) { 0 }

          context 'when quote_price_increase_percentage present' do
            let(:quote_price_increase_percentage) { 20 }

            its(:result) do
              expected_vehicles = [
                { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], trader_price: 1200 },
                { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], trader_price: 2400 },
                { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 25", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], trader_price: 1200 },
                { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000, quote_id: 'quote1', eta: "< 30", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], trader_price: 2400 },
                { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [], trader_price: 1200 },
                { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [], trader_price: 0 },
                { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [], trader_price: 1200 }
              ]

              is_expected.to eq(
                vehicles: expected_vehicles,
                booking_fee: nil,
                distance: '100 miles',
                duration: '110 minutes'
              )
            end
          end

          context 'when quote_price_increase_pounds present' do
            let(:quote_price_increase_pounds) { 20 }

            its(:result) do
              expected_vehicles = [
                { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], trader_price: 3000 },
                { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], trader_price: 4000 },
                { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 25", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], trader_price: 3000 },
                { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000, quote_id: 'quote1', eta: "< 30", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], trader_price: 4000 },
                { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [], trader_price: 3000 },
                { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [], trader_price: 2000 },
                { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [], trader_price: 3000 }
              ]

              is_expected.to eq(
                vehicles: expected_vehicles,
                booking_fee: nil,
                distance: '100 miles',
                duration: '110 minutes'
              )
            end
          end

          context 'when both quote_price_increase_percentage and quote_price_increase_pounds present' do
            let(:quote_price_increase_percentage) { 20 }
            let(:quote_price_increase_pounds) { 20 }

            its(:result) do
              expected_vehicles = [
                { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], trader_price: 3200 },
                { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [], trader_price: 4400 },
                { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 25", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], trader_price: 3200 },
                { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000, quote_id: 'quote1', eta: "< 30", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], trader_price: 4400 },
                { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [], trader_price: 3200 },
                { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [], trader_price: 2000 },
                { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [], trader_price: 3200 }
              ]

              is_expected.to eq(
                vehicles: expected_vehicles,
                booking_fee: nil,
                distance: '100 miles',
                duration: '110 minutes'
              )
            end
          end
        end

        context 'when only OT returns vehicles' do
          let(:gett_vehicles) { [] }
          let(:get_e_vehicles) { [] }
          let(:carey_vehicles) { [] }

          it { is_expected.to be_success }
          its(:result) do
            expected_vehicles = [
              { name: gt_vehicle1.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { name: gt_vehicle2.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 25", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000, quote_id: 'quote1', eta: "< 30", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { name: carey_vehicle.name, earliest_available_in: 60, service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
              { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
              { name: get_e_vehicle1.value, earliest_available_in: 60, service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
            ]

            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end

        context 'when only Gett returns vehicles' do
          let(:ot_vehicles) { [] }
          let(:get_e_vehicles) { [] }
          let(:carey_vehicles) { [] }

          it { is_expected.to be_success }
          its(:result) do
            expected_vehicles = [
              { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { name: ot_vehicle1.name, earliest_available_in: 60, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { name: ot_vehicle2.name, earliest_available_in: 40, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { name: carey_vehicle.name, earliest_available_in: 60, service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
              { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
              { name: get_e_vehicle1.value, earliest_available_in: 60, service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
            ]
            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end

        context 'when only Get-E returns vehicles' do
          let(:gett_vehicles) { [] }
          let(:ot_vehicles) { [] }
          let(:carey_vehicles) { [] }

          it { is_expected.to be_success }
          its(:result) do
            expected_vehicles = [
              { name: gt_vehicle1.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { name: gt_vehicle2.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { name: ot_vehicle1.name, earliest_available_in: 60, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { name: ot_vehicle2.name, earliest_available_in: 40, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { name: carey_vehicle.name, earliest_available_in: 60, service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
              { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
              { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
            ]

            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end

        context 'when all services returns empty vehicles' do
          let(:gett_vehicles) { [] }
          let(:ot_vehicles) { [] }
          let(:get_e_vehicles) { [] }
          let(:carey_vehicles) { [] }

          it { is_expected.to be_success }
          its(:result) do
            expected_vehicles = [
              { name: gt_vehicle1.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { name: gt_vehicle2.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { name: ot_vehicle1.name, earliest_available_in: 60, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { name: ot_vehicle2.name, earliest_available_in: 40, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { name: carey_vehicle.name, earliest_available_in: 60, service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
              { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
              { name: get_e_vehicle1.name, earliest_available_in: 60, service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
            ]

            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end

        context 'when more than one of vehicle type available' do
          let!(:get_e_vehicle2) { create(:vehicle, :get_e, name: get_e_vehicle1.name, value: 'get_e_vehicle2') }

          let(:get_e_vehicles) do
            [
              {
                value: get_e_vehicle1.value,
                name: get_e_vehicle1.name,
                price: 1000,
                quote_id: "quote1"
              },
              {
                value: get_e_vehicle2.value,
                name: get_e_vehicle2.name,
                price: 2000,
                quote_id: "quote2"
              }
            ]
          end

          before do
            service.execute
          end

          it { is_expected.to be_success }

          it 'should return cheapest vehicle' do
            expected_vehicles = [
              { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000.0, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000.0, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
              { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000.0, quote_id: 'quote1', eta: "< 25", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000.0, quote_id: 'quote1', eta: "< 30", service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
              { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000.0, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
              { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
              { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
            ]
            expect(subject.result).to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end
      end

      context 'when Gett goes wrong' do
        let(:expected_vehicles) do
          [
            { name: gt_vehicle1.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { name: gt_vehicle2.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000.0, quote_id: 'quote1', eta: '< 25', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000.0, quote_id: 'quote1', eta: '< 30', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000.0, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
            { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
            { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
          ]
        end

        context 'when it crashes' do
          let(:gett_vehicles) { [] }

          before do
            allow(gett_response).to receive(:execute).and_raise(StandardError.new('something went wrong'))
            expect(Airbrake).to receive(:notify)
            service.execute
          end

          it { is_expected.to be_success }
          its(:result) do
            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end
      end

      context 'when OT API goes wrong' do
        let(:expected_vehicles) do
          [
            { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000.0, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000.0, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { name: ot_vehicle1.name, earliest_available_in: 60, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { name: ot_vehicle2.name, earliest_available_in: 40, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000.0, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
            { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
            { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
          ]
        end

        context 'when it crashes' do
          let(:ot_vehicles) { [] }

          before do
            allow(ot_response).to receive(:execute).and_raise(StandardError.new('something went wrong'))
            expect(Airbrake).to receive(:notify)
            service.execute
          end

          it { is_expected.to be_success }
          its(:result) do
            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end
      end

      context 'when Get-E API goes wrong' do
        let(:expected_vehicles) do
          [
            { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000.0, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000.0, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000.0, quote_id: 'quote1', eta: '< 25', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000.0, quote_id: 'quote1', eta: '< 30', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000.0, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
            { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
            { name: get_e_vehicle1.name, earliest_available_in: 60, service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
          ]
        end

        context 'when it crashes' do
          let(:get_e_vehicles) { [] }

          before do
            allow(get_e_response).to receive(:execute).and_raise(StandardError.new('something went wrong'))
            expect(Airbrake).to receive(:notify)
            service.execute
          end

          it { is_expected.to be_success }
          its(:result) do
            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end
      end

      context 'when Carey API goes wrong' do
        let(:expected_vehicles) do
          [
            { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: '< 25', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000, quote_id: 'quote1', eta: '< 30', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { name: carey_vehicle.name, earliest_available_in: 60, service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
            { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
            { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
          ]
        end

        context 'when it crashes' do
          let(:carey_vehicles) { [] }

          before do
            allow(carey_response).to receive(:execute).and_raise(StandardError.new('something went wrong'))
            expect(Airbrake).to receive(:notify)
            service.execute
          end

          it { is_expected.to be_success }

          its(:result) do
            is_expected.to eq(
              vehicles: expected_vehicles,
              booking_fee: nil,
              distance: '100 miles',
              duration: '110 minutes'
            )
          end
        end
      end

      context 'when both services returns empty results' do
        let(:gett_vehicles)  { [] }
        let(:get_e_vehicles) { [] }
        let(:ot_vehicles)    { [] }
        let(:carey_vehicles) { [] }

        before { service.execute }

        it { is_expected.to be_success }
        its(:result) do
          expected_vehicles = [
            { name: gt_vehicle1.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { name: gt_vehicle2.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
            { name: ot_vehicle1.name, earliest_available_in: 60, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { name: ot_vehicle2.name, earliest_available_in: 40, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
            { name: carey_vehicle.name, earliest_available_in: 60, service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
            { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
            { name: get_e_vehicle1.name, earliest_available_in: 60, service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
          ]

          is_expected.to eq(
            vehicles: expected_vehicles,
            booking_fee: nil,
            distance: '100 miles',
            duration: '110 minutes'
          )
        end
      end
    end

    context 'when TravelRules disallow to use Gett service' do
      let(:allowed_services) { [:ot, :get_e, :carey] }
      let(:gett_vehicles) { [] }

      before { service.execute }

      it { is_expected.to be_success }
      its(:result) do
        expected_vehicles = [
          { name: gt_vehicle1.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
          { name: gt_vehicle2.name, earliest_available_in: 30, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
          { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000.0, quote_id: 'quote1', eta: '< 25', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
          { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000.0, quote_id: 'quote1', eta: '< 30', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
          { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000.0, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
          { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
          { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
        ]

        is_expected.to eq(
          vehicles: expected_vehicles,
          booking_fee: nil,
          distance: '100 miles',
          duration: '110 minutes'
        )
      end
    end

    context 'when TravelRules disallow to use OT service' do
      let(:allowed_services) { [:gett, :get_e, :carey] }
      let(:ot_vehicles) { [] }

      before { service.execute }

      it { is_expected.to be_success }
      its(:result) do
        expected_vehicles = [
          { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000.0, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
          { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000.0, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
          { name: ot_vehicle1.name, earliest_available_in: 60, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
          { name: ot_vehicle2.name, earliest_available_in: 40, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
          { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
          { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
          { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
        ]
        is_expected.to eq(
          vehicles: expected_vehicles,
          booking_fee: nil,
          distance: '100 miles',
          duration: '110 minutes'
        )
      end
    end

    context 'when TravelRules disallow to use Get-E service' do
      let(:allowed_services) { [:gett, :ot] }
      let(:get_e_vehicles) { [] }

      before { service.execute }

      it { is_expected.to be_success }
      its(:result) do
        expected_vehicles = [
          { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000.0, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
          { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000.0, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
          { name: ot_vehicle1.name, value: ot_vehicle1.value, earliest_available_in: 60, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], price: 1000, eta: '< 25', quote_id: "quote1" },
          { name: ot_vehicle2.name, value: ot_vehicle2.value, earliest_available_in: 40, service_type: 'ot', prebook: false, via: 'ot', description: '', details: [], price: 2000, eta: '< 30', quote_id: "quote1" },
          { value: carey_vehicle.value, name: carey_vehicle.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 0", service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
          { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
          { name: get_e_vehicle1.name, earliest_available_in: 60, service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
        ]
        is_expected.to eq(
          vehicles: expected_vehicles,
          booking_fee: nil,
          distance: '100 miles',
          duration: '110 minutes'
        )
      end
    end

    context 'when TravelRules disallow to use Carey service' do
      let(:allowed_services) { [:gett, :ot] }
      let(:carey_vehicles) { [] }

      before { service.execute }

      it { is_expected.to be_success }
      its(:result) do
        expected_vehicles = [
          { value: gt_vehicle1.value, name: gt_vehicle1.name, earliest_available_in: 30, price: 1000, eta: 1, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
          { value: gt_vehicle2.value, name: gt_vehicle2.name, earliest_available_in: 30, price: 2000, eta: 5, service_type: 'gett', prebook: false, via: 'gett', description: '', details: [] },
          { value: ot_vehicle1.value, name: ot_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: '< 25', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
          { value: ot_vehicle2.value, name: ot_vehicle2.name, earliest_available_in: 40, price: 2000, quote_id: 'quote1', eta: '< 30', service_type: 'ot', prebook: false, via: 'ot', description: '', details: [] },
          { name: carey_vehicle.name, earliest_available_in: 60, service_type: 'carey', prebook: false, via: 'carey', description: '', details: [] },
          { value: sp_vehicle1.value, name: sp_vehicle1.name, earliest_available_in: 60, price: 0, quote_id: 'quote1', eta: "< 30", service_type: 'manual', prebook: false, via: 'manual', description: '', details: [] },
          { value: get_e_vehicle1.value, name: get_e_vehicle1.name, earliest_available_in: 60, price: 1000, quote_id: 'quote1', eta: "< 30", service_type: 'get_e', prebook: false, via: 'get_e', description: '', details: [] }
        ]

        is_expected.to eq(
          vehicles: expected_vehicles,
          booking_fee: nil,
          distance: '100 miles',
          duration: '110 minutes'
        )
      end
    end
  end

  describe '#vehicles_params' do
    subject(:vehicles_params) { service.send(:vehicles_params) }

    describe ':scheduled_at' do
      let(:scheduled_at) { '2018-01-01 10:00 +0200' }

      it 'casts scheduled_at to pickup address timezone' do
        expect(vehicles_params[:scheduled_at].strftime('%H:%M')).to eq('08:00')
      end

      context "when params[:scheduled_at] is blank" do
        before { Timecop.freeze('2018-02-01 12:00 +0200') }
        after  { Timecop.return }

        let(:scheduled_at) { nil }

        it 'has value of current time + asap delay (6 minutes) in relevant timezone' do
          expect(vehicles_params[:scheduled_at].strftime('%Y-%m-%d %H:%M')).to eq('2018-02-01 10:06')
        end
      end

      context "when params[:scheduled_type] is 'now'" do
        before { Timecop.freeze('2018-02-01 12:00 +0200') }
        after  { Timecop.return }

        let(:params) { super().merge(scheduled_type: 'now') }

        it 'ignores :scheduled_at value and sets to current time + asap delay (6 minutes) in relevant timezone' do
          expect(vehicles_params[:scheduled_at].strftime('%Y-%m-%d %H:%M')).to eq('2018-02-01 10:06')
        end
      end
    end
  end
end
