require 'features_helper'

feature 'Pricing rule applicability' do
  let(:company) { create(:company) }
  let(:new_booking_page) { Pages::App.new_booking }
  let(:start_time) { '00:00' }
  let(:end_time) { '23:59' }
  let(:booking_type) { 'both' }
  let(:rule) { create_rule }
  let(:vehicle) { 'Standard' }

  def create_rule(args = {})
    create(:pricing_rule, :area, {
      base_fare: 55,
      company: company,
      pickup_polygon: [{ lat: 0, lng: 0 }, { lat: 0.5, lng: 0 }, { lat: 0, lng: 0.5 }],
      booking_type: booking_type,
      vehicle_types: [vehicle],
      min_time: start_time,
      max_time: end_time,
      initial_cost: 10,
      after_distance: 1,
      after_cost: 100
    }.merge(args))
  end

  before do
    rule
    set_mock_header google_maps: { distance_matrix: { distance: 11 } }
    login_to_app_as(company.admin.email)
    new_booking_page.load
    new_booking_page.passenger_name.select(company.admin.first_name)
  end

  let(:inside1) { { lat: 0.1, lng: 0.1 } }
  let(:inside2) { { lat: 0.1, lng: 0.1 } }
  let(:outside) { { lat: 0.3, lng: 0.3 } }

  scenario '- poligon rule' do
    # destination inside poligon
    set_mock_header google_maps: { details: inside1 }
    new_booking_page.destination_address.select('221b Baker Street, London, UK')
    # pickup inside poligon
    set_mock_header google_maps: { details: inside2 }
    new_booking_page.pickup_address.select('221b Baker Street, London, UK')

    new_booking_page.vehicles.wait_until_available
    new_booking_page.vehicles.standard.click

    expect(new_booking_page.vehicles.description.price.text).to eql('£1010.00*')

    # destination outside poligon
    set_mock_header google_maps: { details: outside }
    new_booking_page.destination_address.select('221b Baker Street, London, UK')

    new_booking_page.vehicles.wait_until_available
    new_booking_page.vehicles.standard.click

    expect(new_booking_page.vehicles.description.price.text).not_to eql('£1010.00*')

    # destination inside poligon
    set_mock_header google_maps: { details: inside1 }
    new_booking_page.destination_address.select('221b Baker Street, London, UK')
    # pickup outside poligon
    set_mock_header google_maps: { details: outside }
    new_booking_page.pickup_address.select('221b Baker Street, London, UK')

    new_booking_page.vehicles.wait_until_available
    new_booking_page.vehicles.standard.click

    expect(new_booking_page.vehicles.description.price.text).not_to eql('£1010.00*')
  end

  scenario '- vehicle rule' do
    # destination inside poligon
    set_mock_header google_maps: { details: inside1 }
    new_booking_page.destination_address.select('221b Baker Street, London, UK')
    # pickup inside poligon
    set_mock_header google_maps: { details: inside2 }
    new_booking_page.pickup_address.select('221b Baker Street, London, UK')

    new_booking_page.vehicles.wait_until_available
    new_booking_page.vehicles.standard.click

    expect(new_booking_page.vehicles.description.price.text).to eql('£1010.00*')

    rule.destroy
    create_rule vehicle_types: ['Black Taxi']

    new_booking_page.pickup_address.select('221b Baker Street, London, UK')
    new_booking_page.vehicles.wait_until_available
    new_booking_page.vehicles.standard.click

    expect(new_booking_page.vehicles.description.price.text).not_to eql('£1010.00*')
  end

  context '- time rule' do
    let(:start_time)  { 10.minutes.ago.strftime('%H:%M:%S') }
    let(:finish_time) { Time.current + 10.minutes }
    let(:end_time)    { finish_time.strftime('%H:%M:%S') }

    scenario 'applies' do
      # destination inside poligon
      set_mock_header google_maps: { details: inside1 }
      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      # pickup inside poligon
      set_mock_header google_maps: { details: inside2 }
      new_booking_page.pickup_address.select('221b Baker Street, London, UK')

      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click
      expect(new_booking_page.vehicles.description.price.text).to eql('£1010.00*')

      rule.destroy

      create_rule max_time: Time.current
      new_booking_page.pickup_address.select('221b Baker Street, London, UK')
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description.price.text).not_to eql('£1010.00*')
    end
  end

  context '- future rule' do
    let(:booking_type) { 'future' }
    scenario 'applies' do
      # destination inside poligon
      set_mock_header google_maps: { details: inside1 }
      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      # pickup inside poligon
      set_mock_header google_maps: { details: inside2 }
      new_booking_page.pickup_address.select('221b Baker Street, London, UK')

      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description.price.text).not_to eql('£1010.00*')

      new_booking_page.schedule_for_later.click
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.description.price.text).to eql('£1010.00*')
    end
  end

  context '- asap rule' do
    let(:booking_type) { 'asap' }
    scenario 'applies' do
      # destination inside poligon
      set_mock_header google_maps: { details: inside1 }
      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      # pickup inside poligon
      set_mock_header google_maps: { details: inside2 }
      new_booking_page.pickup_address.select('221b Baker Street, London, UK')

      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description.price.text).to eql('£1010.00*')

      new_booking_page.schedule_for_later.click
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.description.price.text).not_to eql('£1010.00*')
    end
  end

  context '- both rule' do
    let(:booking_type) { 'both' }
    scenario 'applies' do
      # destination inside poligon
      set_mock_header google_maps: { details: inside1 }
      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      # pickup inside poligon
      set_mock_header google_maps: { details: inside2 }
      new_booking_page.pickup_address.select('221b Baker Street, London, UK')

      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description.price.text).to eql('£1010.00*')

      new_booking_page.schedule_for_later.click
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.description.price.text).to eql('£1010.00*')
    end
  end

  context 'point to point rule' do
    let(:rule) do
      create_rule \
        rule_type: 'point_to_point',
        pickup_point: pickup,
        destination_point: dest,
        price_type: 'fixed',
        base_fare: 10000
    end
    let(:pickup) { { lat: rand * 90, lng: rand * 90 } }
    let(:dest)   { { lat: rand * 90, lng: rand * 90 } }

    scenario 'for given addresses applies' do
      # destination inside poligon
      set_mock_header google_maps: { details: dest }
      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      # pickup inside poligon
      set_mock_header google_maps: { details: pickup }
      new_booking_page.pickup_address.select('221b Baker Street, London, UK')

      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description.price.text).to eql('£10000.00*')

      clear_all_headers
      new_booking_page.pickup_address.select('221b Baker Street, London, UK')

      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.description.price.text).not_to eql('£10000.00*')
    end
  end

  scenario 'disabled rule should not change price' do
    # destination inside poligon
    set_mock_header google_maps: { details: inside1 }
    new_booking_page.destination_address.select('221b Baker Street, London, UK')
    # pickup inside poligon
    set_mock_header google_maps: { details: inside2 }
    new_booking_page.pickup_address.select('221b Baker Street, London, UK')

    new_booking_page.vehicles.wait_until_available
    new_booking_page.vehicles.standard.click

    expect(new_booking_page.vehicles.description.price.text).to eql('£1010.00*')

    rule.active = false
    rule.save

    new_booking_page.pickup_address.select('221b Baker Street, London, UK')

    new_booking_page.vehicles.wait_until_available
    new_booking_page.vehicles.standard.click

    expect(new_booking_page.vehicles.description.price.text).not_to eql('£1010.00*')
  end

  context 'rule priority' do
    let(:area_rule) do
      create_rule \
        pickup_polygon: [{ lat: 0, lng: 0 }, { lat: 0.5, lng: 0 }, { lat: 0, lng: 0.5 }],
        price_type: 'meter',
        initial_cost: 10,
        after_cost: 0
    end

    let(:rule) do
      create_rule \
        rule_type: 'point_to_point',
        pickup_point: inside1,
        destination_point: inside2,
        price_type: 'meter',
        initial_cost: 1,
        after_cost: 0
    end

    let(:inside1) { { lat: 0.1, lng: 0.1 } }
    let(:inside2) { { lat: 0.1, lng: 0.1 } }
    scenario 'disabled rule should not change price' do
      area_rule
      # destination inside poligon
      set_mock_header google_maps: { details: inside1 }
      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      # pickup inside poligon
      set_mock_header google_maps: { details: inside2 }
      new_booking_page.pickup_address.select('221b Baker Street, London, UK')

      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description.price.text).to eql('£1.00*')

      rule.active = false
      rule.save

      new_booking_page.pickup_address.select('221b Baker Street, London, UK')

      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description.price.text).to eql('£10.00*')

      area_rule.active = false
      area_rule.save
      new_booking_page.pickup_address.select('221b Baker Street, London, UK')

      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description.price.text).not_to eql('£1.00*')
      expect(new_booking_page.vehicles.description.price.text).not_to eql('£10.00*')
    end
  end
end
