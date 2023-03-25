require 'features_helper'

feature 'Pricing Rules' do
  let(:edit_page)  { Pages::Admin.edit_company }
  let(:company)    { create(:company) }
  let(:price_rule) { wait_until_true { edit_page.price_rules.first } }

  include DrawHelper
  before do
    login_as_super_admin

    edit_page.load id: company.id
    edit_page.pricing_tab.click
    edit_page.add_new_price_rule.click
  end

  scenario 'empty validation' do
    edit_page.new_price_rule_modal.save_button.click

    modal = edit_page.new_price_rule_modal
    wait_until_true { modal.rule_name.error.text.present? }
    expect(modal.rule_name.error.text).to eql('Give this rule a name')
    expect(modal.pickup_address.error.text).to eql("can't be blank")
    expect(modal.destination_address.error.text).to eql("can't be blank")
    expect(modal.base_fare.error.text).to eql("can't be blank")

    modal.meter_price.click
    edit_page.new_price_rule_modal.save_button.click

    expect(modal.initial_cost.error.text).to eql("can't be blank")
    expect(modal.after_distance.error.text).to eql("can't be blank")
    expect(modal.after_cost.error.text).to eql("can't be blank")
    expect(modal).to have_no_base_fare

    modal.area.click

    edit_page.new_price_rule_modal.save_button.click

    expect(modal.initial_cost.error.text).to eql("can't be blank")
    expect(modal.after_distance.error.text).to eql("can't be blank")
    expect(modal.after_cost.error.text).to eql("can't be blank")
    expect(modal).to have_no_pickup_address
    expect(modal).to have_no_destination_address
    expect(modal).to have_no_base_fare

    edit_page.new_price_rule_modal.min_time.set 4.minutes.ago.hour, 4.minutes.ago.min
    edit_page.new_price_rule_modal.max_time.set 5.minutes.ago.hour, 5.minutes.ago.min
    edit_page.new_price_rule_modal.save_button.click

    expect(edit_page.new_price_rule_modal.max_time.hour.error.text).to eql('after time should be less than before time')
  end

  scenario 'successful creation point_to_point with fixed_price' do
    data = edit_page.new_price_rule_modal.populate point_to_point: true, fixed_price: true
    edit_page.new_price_rule_modal.save_button.click

    expect(price_rule.name.text).to eql(data[:rule_name])
    expect(price_rule.pickup.text).to match(data[:pickup_address])
    expect(price_rule.destination.text).to match(data[:destination_address])
    actual = price_rule.vehicle_types.types.map(&:downcase)
    expect(actual).to match_array(data[:car_types].map { |ct| ct.to_s.tr('_', ' ') })
    expect(price_rule.type.text).to eql('Fixed price')
    expect(price_rule.active).to be_checked
    expect(price_rule).to have_edit
    expect(price_rule).to have_delete
  end

  scenario 'successful creation point_to_point with meter price' do
    data = edit_page.new_price_rule_modal.populate point_to_point: true, fixed_price: false
    edit_page.new_price_rule_modal.save_button.click

    expect(price_rule.name.text).to eql(data[:rule_name])
    expect(price_rule.pickup.text).to match(data[:pickup_address])
    expect(price_rule.destination.text).to match(data[:destination_address])
    actual = price_rule.vehicle_types.types.map(&:downcase)
    expect(actual).to match_array(data[:car_types].map { |ct| ct.to_s.tr('_', ' ') })
    expect(price_rule.type.text).to eql('Internal meter')
    expect(price_rule.active).to be_checked
    expect(price_rule).to have_edit
    expect(price_rule).to have_delete
  end

  scenario 'successful creation area with meter price', sporadic: true do
    data = edit_page.new_price_rule_modal.populate point_to_point: false, fixed_price: false
    edit_page.new_price_rule_modal.save_button.click

    expect(price_rule.name.text).to eql(data[:rule_name])
    actual = price_rule.vehicle_types.types.map(&:downcase)
    expect(actual).to match_array(data[:car_types].map { |ct| ct.to_s.tr('_', ' ') })
    expect(price_rule.type.text).to eql('Internal meter / Area')
    expect(price_rule.active).to be_checked
    expect(price_rule).to have_edit
    expect(price_rule).to have_delete
  end

  scenario 'successfuly saves policy' do
    current = Time.current
    min_time = [current.end_of_day - 2.hours, current].min
    max_time = min_time + 1.hour
    data = edit_page.new_price_rule_modal.populate \
      point_to_point: true,
      asap: false,
      fixed_price: false,
      min_time: min_time,
      max_time: max_time

    edit_page.new_price_rule_modal.save_button.click
    expect(price_rule.name.text).to eql(data[:rule_name])

    price_rule.edit.click

    modal = edit_page.new_price_rule_modal

    expect(modal.rule_name.value).to eql(data[:rule_name])

    expect(modal.min_time.hour.selected_options).to eql(format('%02i', data[:min_time].hour))
    expect(modal.min_time.min.selected_options).to eql(format('%02i', data[:min_time].min))
    expect(modal.max_time.hour.selected_options).to eql(format('%02i', data[:max_time].hour))
    expect(modal.min_time.min.selected_options).to eql(format('%02i', data[:min_time].min))

    expect(modal.future['class']).to include('ant-radio-button-wrapper-checked')

    expect(modal.car_types.black_taxi_xl).to be_checked
    expect(modal.car_types.black_taxi).not_to be_checked

    expect(modal.point_to_point['class']).to include('ant-radio-button-wrapper-checked')

    expect(modal.pickup_address.selected_value.text).to eql(data[:pickup_address])
    expect(modal.destination_address.selected_value.text).to eql(data[:destination_address])

    expect(modal.meter_price['class']).to include('ant-radio-button-wrapper-checked')

    expect(modal.initial_cost.value).to eql(data[:initial_cost].to_s)
    expect(modal.after_distance.value).to eql(data[:after_distance].to_s)
    expect(modal.after_cost.value).to eql(data[:after_cost].to_s)
  end
end
