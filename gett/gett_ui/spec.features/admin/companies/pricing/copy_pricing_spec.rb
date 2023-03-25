require 'features_helper'

feature 'Pricing Rules' do
  let(:edit_page)  { Pages::Admin.edit_company }
  let(:company)    { create(:company) }
  let(:company1)   { create(:company) }

  let(:start_time) { '00:00' }
  let(:end_time) { '23:59' }
  let(:booking_type) { 'both' }
  let(:vehicle) { 'Standard' }

  let!(:rule1)      { create_rule }
  let!(:rule2)      { create_rule type: :point_to_point, vehicle_types: ['BlackTaxi'] }

  def create_rule(args = {})
    create(:pricing_rule, args.delete(:type){ :area }, {
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

  def format_rule(rule)
    rule.values.slice(*(rule.values.keys - [:id, :company_id, :created_at, :updated_at]))
  end

  before do
    login_as_super_admin

    edit_page.load id: company1.id
    edit_page.pricing_tab.click
  end

  scenario 'empty validation' do
    edit_page.copy_pricing.click
    wait_until_true { edit_page.has_copy_pricing_modal? }
    edit_page.copy_pricing_modal.company.select company.name
    edit_page.copy_pricing_modal.submit_button.click

    wait_until_true { edit_page.price_rules.size == 2 }

    expect([rule1, rule2].map(&method(:format_rule))).to match_array(company1.pricing_rules.map(&method(:format_rule)))
    expect(([rule1, rule2].map(&:id) + company1.pricing_rules.map(&:id)).uniq.size).to eql(4)
  end
end
