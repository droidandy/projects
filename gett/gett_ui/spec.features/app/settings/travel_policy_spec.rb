require 'features_helper'

feature 'Travel Policy' do
  let(:travel_policy_page) { Pages::App.travel_policy }
  let(:company)            { create(:company, :enterprise) }
  let(:new_name)           { Faker::Lorem.sentence(3) }
  let!(:departments)       { create_list(:department, 3, company: company) }
  let!(:work_roles)        { create_list(:work_role, 3, company: company) }
  let!(:users)             { create_list(:member, 3, company: company) }
  let!(:existed_tp)        { create(:travel_rule, company: company, week_days: ['Wednesday', 'Thursday']) }
  let(:no_users_error)     { 'Make sure to select at least a user, a user role, or a department' }
  let(:blank_name_error)   { 'Give this rule a name' }

  before do
    login_to_app_as(company.admin.email)
    travel_policy_page.load
    expect(travel_policy_page).to be_loaded
  end

  scenario 'Add' do
    travel_policy_page.add_new_rule_button.click
    travel_policy_page.wait_until_rule_form_visible
    form = travel_policy_page.rule_form
    form.save_button.click
    expect(form.name.error_message).to eql(blank_name_error)
    form.name.set(new_name)

    form.guest_passenger.click
    form.save_button.click
    expect(form.guest_passenger.error_message).to eql(no_users_error)

    form.departments.select(departments.first.name)
    form.work_roles.select(work_roles.last.name)
    form.users.select(users.first.full_name)

    form.location.select('Leeds')
    form.distance_more_than.set(5)
    form.distance_less_than.set(20)
    form.tuesday.click
    form.saturday.click

    form.time_after.hours.select('05')
    form.time_after.minutes.select('35')

    form.time_before.minutes.select('45')
    form.time_before.hours.select('04')
    expect(form.time_before.minutes.error_message).to have_text('after time should be less than before time')

    form.time_before.hours.select('10')
    form.car_types.black_taxi_xl.click
    form.car_types.people_carrier.click

    form.save_button.click
    travel_policy_page.wait_until_rule_form_invisible

    expect(travel_policy_page).to have_rules(count: 2)
    new_rule = travel_policy_page.rules.last
    expect(new_rule).to have_priority(text: 2)
    expect(new_rule).to have_rule(text: new_name)
    expect(new_rule.active).to be_checked

    new_rule.edit_button.click
    travel_policy_page.wait_until_rule_form_visible
    expect(form.departments.selected_options).to eql([departments.first.name])
    expect(form.work_roles.selected_options).to eql([work_roles.last.name])
    expect(form.users.selected_options).to eql([users.first.full_name])
    expect(form.location.selected_options).to eql('Leeds')

    expect(form.distance_more_than.value).to eql('5')
    expect(form.distance_less_than.value).to eql('20')
    expect(form.time_after.hours.selected_options).to eql('05')
    expect(form.time_after.minutes.selected_options).to eql('35')
    expect(form.time_before.hours.selected_options).to eql('10')
    expect(form.time_before.minutes.selected_options).to eql('45')
    expect(form.car_types.black_taxi).to be_checked
    expect(form.car_types.standard).to be_checked
    expect(form.car_types.executive).to be_checked
    expect(form.car_types.black_taxi_xl).not_to be_checked
    expect(form.car_types.people_carrier).not_to be_checked
  end

  scenario 'Edit' do
    expect(travel_policy_page).to have_rules(count: 1)
    travel_policy_page.rules.first.edit_button.click
    travel_policy_page.wait_until_rule_form_visible
    form = travel_policy_page.rule_form

    form.name.clear
    form.save_button.click
    expect(form.name.error_message).to eql(blank_name_error)
    form.name.set(new_name)

    form.guest_passenger.click
    form.save_button.click
    expect(form.guest_passenger.error_message).to eql(no_users_error)

    form.departments.select(departments.last.name)
    form.work_roles.select(work_roles.first.name)
    form.users.select(users.last.full_name)

    form.location.select('Greater London')
    form.distance_more_than.set(10)
    form.distance_less_than.set(30)
    form.tuesday.click
    form.wednesday.click

    form.time_after.hours.select('01')
    form.time_after.minutes.select('15')
    form.time_before.hours.select('15')
    form.time_before.minutes.select('40')

    form.car_types.black_taxi.click
    form.car_types.executive.click

    form.save_button.click
    travel_policy_page.wait_until_rule_form_invisible

    expect(travel_policy_page).to have_rules(count: 1)
    edited_rule = travel_policy_page.rules.first
    expect(edited_rule).to have_priority(text: 1)
    expect(edited_rule).to have_rule(text: new_name)
    expect(edited_rule.active).to be_checked

    edited_rule.edit_button.click
    travel_policy_page.wait_until_rule_form_visible
    expect(form.departments.selected_options).to eql([departments.last.name])
    expect(form.work_roles.selected_options).to eql([work_roles.first.name])
    expect(form.users.selected_options).to eql([users.last.full_name])
    expect(form.location.selected_options).to eql('Greater London')

    expect(form.distance_more_than.value).to eql('10')
    expect(form.distance_less_than.value).to eql('30')
    expect(form.time_after.hours.selected_options).to eql('01')
    expect(form.time_after.minutes.selected_options).to eql('15')
    expect(form.time_before.hours.selected_options).to eql('15')
    expect(form.time_before.minutes.selected_options).to eql('40')
    expect(form.car_types.black_taxi).not_to be_checked
    expect(form.car_types.standard).to be_checked
    expect(form.car_types.executive).not_to be_checked
    expect(form.car_types.black_taxi_xl).to be_checked
    expect(form.car_types.people_carrier).to be_checked
  end

  scenario 'Delete' do
    expect(travel_policy_page).to have_rules(count: 1)
    travel_policy_page.rules.first.delete_button.click
    travel_policy_page.delete_modal.ok_button.click
    expect(travel_policy_page).to have_text("You haven't got any travel policies in place.")
  end
end
