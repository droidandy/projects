require 'rails_helper'

RSpec.describe TravelRules::VehicleAvailability, type: :service do
  let(:vehicle)        { create(:vehicle, :gett) }
  let(:gett_vehicle)   { Bookings::Vehicle.new(service_type: 'gett', name: 'GettCar1', vehicle_ids: [vehicle.id]) }
  let(:porsche)        { Bookings::Vehicle.new(service_type: 'gett', name: 'Porsche', vehicle_ids: []) }
  let(:ot_vehicle)     { Bookings::Vehicle.new(service_type: 'ot', name: 'Exec', vehicle_ids: [], value: 'ot-value', price: 1000.0) }
  let(:get_e_vehicle)  { Bookings::Vehicle.new(service_type: 'get_e', name: 'Exec', vehicle_ids: [], value: 'get_e-value', price: 1000.0) }
  let(:manual_vehicle) { Bookings::Vehicle.new(service_type: 'manual', name: 'Special', vehicle_ids: [], value: 'special-value', price: 0) }
  let(:carey_vehicle)  { Bookings::Vehicle.new(service_type: 'carey', name: 'Chauffeur', vehicle_ids: [], value: 'carey-value') }
  let(:vehicles)       { [gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle, carey_vehicle] }
  let(:passenger)      { create :passenger, company: company }
  let(:company)        { create :company }
  let(:with_manual)    { nil }

  let(:params) { { passenger_id: passenger.id, pickup_address: {country_code: "GB"} } }

  let(:service) do
    TravelRules::VehicleAvailability.new(
      vehicles: vehicles,
      params: params,
      with_manual: with_manual
    )
  end

  service_context { { company: company } }

  # TODO: test for service outside GB

  describe '#execute!' do
    service_context { { company: company, admin: create(:user, :superadmin) } }

    before { allow(service).to receive(:applied_rule).and_return(nil) }

    it 'executes processing methods' do
      expect(service).to receive(:mark_available!).ordered
      expect(service).to receive(:disallow_by_order_type!).ordered
      expect(service).to receive(:disallow_by_country!).ordered
      expect(service).to receive(:disallow_by_stop_points!).ordered
      expect(service).to receive(:disallow_by_scheduled_type!).ordered
      expect(service).to receive(:disallow_by_policy!).ordered
      expect(service).to receive(:disallow_by_rule!).ordered
      expect(service).to receive(:reject_by_availability_fallbacks!).ordered
      expect(service).to receive(:disallow_by_availability!).ordered
      expect(service).to receive(:disallow_by_cheapest!).ordered
      expect(service).to receive(:sort_by_availability_and_price!).ordered
      expect(service).to receive(:uniq_by_name!).ordered
      service.execute
    end

    it 'yields conclusion vehicle availability' do
      allow(service).to receive(:allowed_services).and_call_original
      expect{ |b| service.execute(&b) }.to yield_with_args([:gett, :ot, :manual])
    end
  end

  describe '#disallow_by_wheelchair!' do
    let(:vehicles) { [gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle] }
    let(:gett_vehicle1) { Bookings::Vehicle.new(service_type: 'gett', name: 'BlackTaxi', vehicle_ids: [vehicle.id]) }
    let(:gett_vehicle2) { Bookings::Vehicle.new(service_type: 'gett', name: 'BlackTaxiXL', vehicle_ids: [vehicle.id]) }
    let(:gett_vehicle3) { Bookings::Vehicle.new(service_type: 'gett', name: 'BlackTaxiXL', vehicle_ids: [vehicle.id]) }

    after { service.send(:disallow_by_wheelchair!) }

    it 'forbids all other vehicles except black cabs' do
      expect(gett_vehicle).to receive(:disallow_with!)
      expect(ot_vehicle).to receive(:disallow_with!)
    end

    it 'allows black cabs through' do
      expect(gett_vehicle1).not_to receive(:disallow_with!)
      expect(gett_vehicle2).not_to receive(:disallow_with!)
      expect(gett_vehicle3).not_to receive(:disallow_with!)
    end
  end

  describe '#disallow_by_order_type!' do
    let(:vehicles) { [gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle] }
    after { service.send(:disallow_by_order_type!) }

    it 'allows gett cars only' do
      params[:as_directed] = true

      expect(gett_vehicle).not_to receive(:disallow_with!)
      expect(ot_vehicle).to receive(:disallow_with!)
      expect(get_e_vehicle).to receive(:disallow_with!)
      expect(manual_vehicle).to receive(:disallow_with!)
    end
  end

  describe '#disallow_by_country!' do
    let(:vehicles) { [gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle] }
    after { service.send(:disallow_by_country!) }

    context 'when county is GB' do
      it 'allows gett cars only' do
        params[:pickup_address][:country_code] = 'GB'

        expect(gett_vehicle).not_to receive(:disallow_with!)
        expect(ot_vehicle).not_to receive(:disallow_with!)
        expect(manual_vehicle).not_to receive(:disallow_with!)

        expect(get_e_vehicle).to receive(:disallow_with!)
      end
    end

    context 'when county is GB' do
      it 'allows gett cars only' do
        params[:pickup_address][:country_code] = 'US'

        expect(get_e_vehicle).not_to receive(:disallow_with!)
        expect(manual_vehicle).not_to receive(:disallow_with!)

        expect(gett_vehicle).to receive(:disallow_with!)
        expect(ot_vehicle).to receive(:disallow_with!)
      end
    end
  end

  describe '#disallow_by_stop_points!' do
    let(:gett_vehicle_standard) { Bookings::Vehicle.new(service_type: 'gett', name: 'Standard', vehicle_ids: [vehicle.id]) }
    let(:vehicles) { [gett_vehicle, gett_vehicle_standard, ot_vehicle] }
    let(:params) { super().merge(stops: [{country_code: 'GB'}]) }

    after { service.send(:disallow_by_stop_points!) }

    it 'disallows Via vehicle in case of stop point on the way' do
      expect(gett_vehicle).not_to receive(:disallow_with!)
      expect(ot_vehicle).not_to receive(:disallow_with!)

      expect(gett_vehicle_standard).to receive(:disallow_with!)
    end
  end

  describe '#disallow_by_scheduled_type!' do
    let(:vehicles) { [porsche, ot_vehicle] }

    context 'when ASAP order' do
      let(:params) { super().merge(scheduled_type: 'now') }

      it 'does not disallow porsche' do
        expect(porsche).not_to receive(:disallow_with!)
        expect(ot_vehicle).to receive(:disallow_with!)
        service.send(:disallow_by_scheduled_type!)
      end
    end

    context 'when non-ASAP order' do
      let(:params)   { super().merge(scheduled_type: 'later') }
      let(:vehicles) { [porsche] }

      it 'disallows porsche' do
        expect(porsche).to receive(:disallow_with!)

        service.send(:disallow_by_scheduled_type!)
      end
    end
  end

  describe '#disallow_by_policy!' do
    let(:vehicles) { [gett_vehicle, manual_vehicle] }
    let(:policy)   { double('TravelRules::VehicleAvailabilityPolicy') }

    before do
      allow(service).to receive(:with_manual).and_return(true)
      allow(service).to receive(:policy).and_return(policy)
      allow(policy).to receive(:allow_manual?).and_return(allow_manual)
    end

    context 'when policy allows' do
      let(:allow_manual) { true }

      it 'does not disallow manual vehicle' do
        expect(gett_vehicle).not_to receive(:disallow_with!)
        expect(manual_vehicle).not_to receive(:disallow_with!)
        service.send(:disallow_by_policy!)
      end
    end

    context "when policy doesn't allow" do
      let(:allow_manual) { false }

      it 'disallows only manual vehicle' do
        expect(gett_vehicle).not_to receive(:disallow_with!)
        expect(manual_vehicle).to receive(:disallow_with!)
        service.send(:disallow_by_policy!)
      end
    end
  end

  describe '#disallow_by_rule!' do
    before { allow(service).to receive(:applied_rule).and_return(rule) }

    context 'when no rule applied' do
      let(:rule) { nil }

      it 'does not disallow vehicles' do
        expect(gett_vehicle).not_to receive(:disallow_with!)
        expect(ot_vehicle).not_to receive(:disallow_with!)
        expect(get_e_vehicle).not_to receive(:disallow_with!)
        service.send(:disallow_by_rule!)
      end
    end

    context 'when rule applied' do
      let(:rule) { create(:travel_rule, vehicles: [vehicle]) }
      before { allow(service).to receive(:applied_rule).and_return(rule) }

      it 'disallows vehicles that are not allowed by rule' do
        expect(gett_vehicle).not_to receive(:disallow_with!)
        expect(ot_vehicle).to receive(:disallow_with!).with(:rule)
        expect(get_e_vehicle).to receive(:disallow_with!).with(:rule)
        service.send(:disallow_by_rule!)
      end
    end

    context 'when manual vehicle' do
      let(:rule) { create(:travel_rule, vehicles: [vehicle]) }
      before { allow(service).to receive(:applied_rule).and_return(rule) }

      it 'disallows vehicles that are not allowed by rule' do
        expect(gett_vehicle).not_to receive(:disallow_with!)
        expect(manual_vehicle).not_to receive(:disallow_with!)

        service.send(:disallow_by_rule!)
      end
    end
  end

  describe '#disallow_by_payment_type!' do
    let(:company)  { create(:company, payment_types: ['passenger_payment_card_periodic']) }
    let(:vehicles) { [gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle] }

    after { service.send(:disallow_by_payment_type!) }

    context 'when company with periodic_payment_type and registered user' do
      it 'doesnt dissallow vehicles' do
        expect(gett_vehicle).not_to receive(:disallow_with!)
      end
    end

    context 'when company with periodic_payment_type and unregistered user' do
      let(:params) { { passenger_id: nil } }

      it 'dissallows all vehicles' do
        expect(get_e_vehicle).to receive(:disallow_with!)
        expect(manual_vehicle).to receive(:disallow_with!)

        expect(gett_vehicle).to receive(:disallow_with!)
        expect(ot_vehicle).to receive(:disallow_with!)
      end
    end

    context 'when payment_method is cash' do
      let(:company) { create(:company, payment_types: ['account', 'cash']) }

      let(:ot_standard)        { Bookings::Vehicle.new(service_type: 'ot', name: 'Standard', vehicle_ids: [vehicle.id]) }
      let(:get_e_standard)     { Bookings::Vehicle.new(service_type: 'ot', name: 'Standard', vehicle_ids: [vehicle.id]) }
      let(:gett_black_taxi)    { Bookings::Vehicle.new(service_type: 'gett', name: 'BlackTaxi', vehicle_ids: [vehicle.id]) }
      let(:gett_black_taxi_xl) { Bookings::Vehicle.new(service_type: 'gett', name: 'BlackTaxiXL', vehicle_ids: [vehicle.id]) }
      let(:ot_black_taxi)      { Bookings::Vehicle.new(service_type: 'ot', name: 'OTBlackTaxi', vehicle_ids: [vehicle.id]) }
      let(:ot_black_taxi_xl)   { Bookings::Vehicle.new(service_type: 'ot', name: 'OTBlackTaxiXL', vehicle_ids: [vehicle.id]) }
      let(:ot_exec)            { ot_vehicle }
      let(:get_e_exec)         { get_e_vehicle }
      let(:ot_mpv)             { Bookings::Vehicle.new(service_type: 'ot', name: 'MPV', vehicle_ids: [vehicle.id]) }
      let(:get_e_mpv)          { Bookings::Vehicle.new(service_type: 'get_e', name: 'MPV', vehicle_ids: [vehicle.id]) }
      let(:special)            { manual_vehicle }
      let(:gett_xl)            { Bookings::Vehicle.new(service_type: 'get_e', name: 'GettXL', vehicle_ids: [vehicle.id]) }
      let(:gett_express)       { Bookings::Vehicle.new(service_type: 'get_e', name: 'GettExpress', vehicle_ids: [vehicle.id]) }

      let(:vehicles) do
        [
          ot_standard,
          get_e_standard,
          gett_black_taxi,
          gett_black_taxi_xl,
          ot_black_taxi,
          ot_black_taxi_xl,
          ot_exec,
          get_e_exec,
          special,
          porsche,
          ot_mpv,
          get_e_mpv,
          gett_xl,
          gett_express
        ]
      end

      let(:params) { { payment_method: 'cash' } }

      it 'disallows all vehicles except Black Taxi and Black Taxi XL' do
        expect(gett_black_taxi).not_to receive(:disallow_with!)
        expect(gett_black_taxi_xl).not_to receive(:disallow_with!)

        expect(ot_standard).to receive(:disallow_with!)
        expect(get_e_standard).to receive(:disallow_with!)
        expect(ot_black_taxi).to receive(:disallow_with!)
        expect(ot_black_taxi_xl).to receive(:disallow_with!)
        expect(ot_exec).to receive(:disallow_with!)
        expect(get_e_exec).to receive(:disallow_with!)
        expect(special).to receive(:disallow_with!)
        expect(porsche).to receive(:disallow_with!)
        expect(ot_mpv).to receive(:disallow_with!)
        expect(get_e_mpv).to receive(:disallow_with!)
        expect(gett_xl).to receive(:disallow_with!)
        expect(gett_express).to receive(:disallow_with!)
      end
    end
  end

  describe '#disallow_by_scheduled_at!' do
    context 'when scheduled at earlier than 2 hours' do
      after { service.send(:disallow_by_scheduled_at!) }
      let(:service) do
        TravelRules::VehicleAvailability.new(
          vehicles: vehicles,
          params: { scheduled_at: 1.hour.from_now.to_s }
        )
      end

      specify { expect(carey_vehicle).to receive(:disallow_with!).with(:early_scheduled) }
    end

    context 'when scheduled at later than 2 hours' do
      after { service.send(:disallow_by_scheduled_at!) }
      let(:service) do
        TravelRules::VehicleAvailability.new(
          vehicles: vehicles,
          params: { scheduled_at: 3.hours.from_now.to_s }
        )
      end

      specify { expect(carey_vehicle).not_to receive(:disallow_with!).with(:early_scheduled) }
    end
  end

  describe '#disallow_by_booker_role!' do
    let(:service) do
      TravelRules::VehicleAvailability.new(
        vehicles: vehicles,
        with_manual: true
      )
    end

    context 'when booker is superadmin' do
      service_context { { company: company, admin: create(:user, :superadmin) } }

      after { service.send(:disallow_by_booker_role!) }

      specify { expect(manual_vehicle).not_to receive(:disallow_with!).with(:only_for_superadmin) }

      it 'allows manual vehicles' do
        expect(service.vehicles).to eq([gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle, carey_vehicle])
      end
    end

    context 'when booker is not superadmin' do
      service_context { { company: company, admin: create(:user, :admin) } }
      after { service.send(:disallow_by_booker_role!) }

      specify { expect(manual_vehicle).to receive(:disallow_with!).with(:only_for_superadmin) }

      it 'allows manual vehicles' do
        expect(service.vehicles).to eq([gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle, carey_vehicle])
      end
    end
  end

  describe '#reject_manual!' do
    let(:params_payment_method) { 'account' }
    let(:service) do
      TravelRules::VehicleAvailability.new(
        vehicles: vehicles,
        params: { payment_method: params_payment_method },
        with_manual: with_manual
      )
    end

    before { service.send(:reject_manual!) }

    it 'forbids manual vehicles' do
      expect(service.vehicles).to eq([gett_vehicle, ot_vehicle, get_e_vehicle, carey_vehicle])
    end

    context 'allows manual vehicles from back_office' do
      let(:with_manual) { true }

      it 'allows manual vehicles' do
        expect(service.vehicles).to eq([gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle, carey_vehicle])
      end
    end

    context 'payment type is cash' do
      let(:with_manual) { true }
      let(:params_payment_method) { 'cash' }

      it 'forbids manual vehicles' do
        expect(service.vehicles).to eq([gett_vehicle, ot_vehicle, get_e_vehicle, carey_vehicle])
      end
    end

    context 'payment type is personal card' do
      let(:with_manual) { true }
      let(:params_payment_method) { 'personal_payment_card' }

      it 'forbids manual vehicles' do
        expect(service.vehicles).to eq([gett_vehicle, ot_vehicle, get_e_vehicle, carey_vehicle])
      end
    end

    context 'payment type is business card' do
      let(:with_manual) { true }
      let(:params_payment_method) { 'business_payment_card' }

      it 'forbids manual vehicles' do
        expect(service.vehicles).to eq([gett_vehicle, ot_vehicle, get_e_vehicle, carey_vehicle])
      end
    end

    context 'payment type is company card' do
      let(:with_manual) { true }
      let(:params_payment_method) { 'company_payment_card' }

      it 'allows manual vehicles' do
        expect(service.vehicles).to eq([gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle, carey_vehicle])
      end
    end
  end

  describe '#reject_by_availability_fallbacks!' do
    let(:gett_vehicle) { Bookings::Vehicle.new(service_type: 'gett', name: 'Car1', vehicle_ids: [], value: primary_value) }
    let(:ot_vehicle)   { Bookings::Vehicle.new(service_type: 'ot', name: 'OTCar1', vehicle_ids: [], value: fallback_value) }
    let(:vehicles)     { [gett_vehicle, ot_vehicle] }

    let(:primary_value)  { nil }
    let(:fallback_value) { nil }

    before do
      # things like this happen in Bookings::Vehicle.all
      gett_vehicle.fallback = ot_vehicle
      ot_vehicle.primary = gett_vehicle
      service.send(:reject_by_availability_fallbacks!)
    end

    context 'when both vehicles are unavailable' do
      it 'rejects fallback vehicle' do
        expect(vehicles).to eq [gett_vehicle]
      end
    end

    context 'when both vehicles are available (have value)' do
      let(:primary_value)  { 'p-value' }
      let(:fallback_value) { 'f-value' }

      it 'rejects fallback vehicle' do
        expect(vehicles).to eq [gett_vehicle]
      end
    end

    context 'when only primary vehicle is available' do
      let(:primary_value) { 'p-value' }

      it 'rejects fallback value' do
        expect(vehicles).to eq [gett_vehicle]
      end
    end

    context 'when only fallback vehicle is available' do
      let(:fallback_value) { 'f-value' }

      it 'rejects primary value' do
        expect(vehicles).to eq [ot_vehicle]
      end
    end
  end

  describe '#disallow_by_availability!' do
    it 'disallows vehicles if they do not have :value, provided by service provider' do
      expect(gett_vehicle).to receive(:disallow_with!).with(:area)
      expect(ot_vehicle).not_to receive(:disallow_with!)
      expect(get_e_vehicle).not_to receive(:disallow_with!)
      service.send(:disallow_by_availability!)
    end
  end

  describe '#disallow_by_cheapest!' do
    let(:other_vehicle)   { create(:vehicle, :one_transport) }
    let(:gett_vehicle)    { Bookings::Vehicle.new(name: 'GettCar1', price: 500, service_type: 'gett') }
    let(:ot_vehicle2)     { Bookings::Vehicle.new(name: 'OtCar1', value: 'ot-value-2', price: 500.0, service_type: 'ot') }
    let(:vehicles)        { [gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle] }
    let(:rule)            { create(:travel_rule, cheapest: true, vehicles: [vehicle, other_vehicle]) }

    before { allow(service).to receive(:applied_rule).and_return(rule) }

    context 'all vehicles are unavailable' do
      let(:gett_vehicle) { Bookings::Vehicle.new(name: 'GettCar1', available: false) }
      let(:ot_vehicle2)  { Bookings::Vehicle.new(name: 'OtCar1', available: false) }

      it 'allows only cheapest vehicle(s)' do
        expect(gett_vehicle).not_to receive(:disallow_with!)
        expect(ot_vehicle).not_to receive(:disallow_with!)
        expect(ot_vehicle2).not_to receive(:disallow_with!)
        service.send(:disallow_by_cheapest!)
      end
    end

    context 'vehicles are available' do
      let(:gett_vehicle) { Bookings::Vehicle.new(name: 'GettCar1', price: 500, available: true) }
      let(:ot_vehicle2)  { Bookings::Vehicle.new(name: 'OtCar1', value: 'ot-value-2', price: 500.0, available: true) }

      it 'allows only cheapest vehicle(s)' do
        expect(gett_vehicle).not_to receive(:disallow_with!)
        expect(ot_vehicle).to receive(:disallow_with!).with(:rule)
        expect(ot_vehicle2).not_to receive(:disallow_with!)
        service.send(:disallow_by_cheapest!)
      end
    end
  end

  describe '#sort_by_availability_and_price!' do
    describe 'in case of available vehicles' do
      let(:splyt_vehicle) do
        Bookings::Vehicle.new(service_type: 'splyt', name: 'Exec', vehicle_ids: [], value: 'exec', price: 100.0)
      end
      let(:vehicles) do
        [gett_vehicle, ot_vehicle, get_e_vehicle, manual_vehicle, carey_vehicle, splyt_vehicle]
          .map do |v|
          v.available = true
          v
        end
      end
      let(:sorted_vehicles) { [manual_vehicle, splyt_vehicle, ot_vehicle, get_e_vehicle, gett_vehicle, carey_vehicle] }

      it 'sorts by availability and price' do
        service.send(:sort_by_availability_and_price!)

        expect(service.vehicles).to eq(sorted_vehicles)
      end
    end

    describe 'in case of unavailable vehicles' do
      let(:splyt_vehicle) do
        Bookings::Vehicle.new(service_type: 'splyt', name: 'Exec', vehicle_ids: [], value: 'exec', price: 100, available: false)
      end
      let(:ot_vehicle) do
        Bookings::Vehicle.new(service_type: 'ot', name: 'Exec', vehicle_ids: [], value: 'exec', price: 200, available: false)
      end
      let(:gett_vehicle) do
        Bookings::Vehicle.new(service_type: 'gett', name: 'Exec', vehicle_ids: [], value: 'exec', price: 300, available: false)
      end
      let(:vehicles) do
        [gett_vehicle, ot_vehicle, splyt_vehicle]
      end

      it 'move OT vehicle to the first place' do
        service.send(:sort_by_availability_and_price!)

        expect(service.vehicles.first).to eq(ot_vehicle)
      end
    end
  end

  describe '#uniq_by_name!' do
    it 'removes duplicate vehicles' do
      service.send(:uniq_by_name!)
      expect(service.vehicles).to eq([gett_vehicle, ot_vehicle, manual_vehicle, carey_vehicle])
    end
  end

  describe '#ignore_rules?' do
    let(:basic_params) { { passenger_id: passenger.id, pickup_address: {country_code: "GB"} } }

    let(:service) { TravelRules::VehicleAvailability.new(params: params) }

    subject { service.send(:ignore_rules?) }

    context "when payment_method is 'account'" do
      let(:params) { basic_params.merge(payment_method: 'account') }

      it { expect(subject).to be_falsy }
    end

    context "when payment_method is 'cash'" do
      let(:params) { basic_params.merge(payment_method: 'cash') }

      it { expect(subject).to be_truthy }
    end

    context "when payment_method is 'personal_payment_card'" do
      let(:params) do
        basic_params.merge(
          payment_method: 'personal_payment_card',
          payment_card_id: payment_card.id,
          passenger_id: passenger.id
        )
      end

      context "passenger's payment card is private" do
        let(:payment_card) { create(:payment_card, :personal, passenger: passenger) }

        it { expect(subject).to be_truthy }
      end

      context "passenger's payment card is not private" do
        let(:payment_card) { create(:payment_card, :business, passenger: passenger) }

        it { expect(subject).to be_falsy }
      end
    end
  end

  describe '#applied_rule' do
    before { Timecop.freeze('2018-01-01 12:00') }
    after  { Timecop.return }

    let(:company) { create(:company) }
    let(:passenger1) { create(:passenger, company: company) }
    let(:passenger2) { create(:passenger, company: company) }

    let(:service) { TravelRules::VehicleAvailability.new(params: params) }
    subject(:applied_rule) { service.send(:applied_rule) }

    context 'when passanger is not present' do
      let(:params) { {passenger_id: ''} }

      context 'when rule allows unregistered passengers' do
        let!(:rule) { create(:travel_rule, :allow_unregistered, company: company, weekdays: 127) }

        it { is_expected.to eq rule }
      end

      context 'when rule does not allow unregistered passengers' do
        let!(:rule) { create(:travel_rule, company: company, weekdays: 127) }

        it { is_expected.to be nil }
      end
    end

    context 'when there are no rules' do
      let(:params) { {passenger_id: passenger1.id} }

      it { is_expected.to be nil }
    end

    context 'when passenger present and there are travel rules' do
      let(:params) { {passenger_id: passenger1.id} }
      let!(:rule1) { create(:travel_rule, company: company, members: [passenger1], priority: 1) }
      let!(:rule2) { create(:travel_rule, company: company, members: [passenger1], priority: 2) }

      let(:negative_check) { double(execute: double(success?: false)) }
      let(:positive_check) { double(execute: double(success?: true)) }

      it 'delegates to RuleChecker to find matching rule' do
        expect(TravelRules::VehicleAvailability::RuleChecker)
          .to receive(:new).with(rule: rule1, params: params).ordered.and_return(negative_check)
        expect(TravelRules::VehicleAvailability::RuleChecker)
          .to receive(:new).with(rule: rule2, params: params).ordered.and_return(positive_check)

        expect(applied_rule).to eq rule2
      end
    end
  end
end
