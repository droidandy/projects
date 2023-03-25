RSpec.shared_examples 'create passenger with role' do |role|
  it "create passenger with role #{role}" do
    department = create_list(:department, 4, company: company).sample.name
    work_role = create_list(:work_role, 4, company: company).sample.name
    booker = create_list(:booker, 4, company: company).sample.full_name
    page = new_passenger_page

    login_to_app_as(user.email)
    passengers_page.load
    passengers_page.new_passenger_button.click
    wait_until_true { page.loaded? }

    # default selected Role is 'Passenger'
    expect(page.role.selected_options).to eql('Passenger')
    page.role.select role

    # validate initial form fields
    expect(page.department.selected_options).to be_blank
    expect(page.work_role.selected_options).to be_blank
    expect(page.home_address.selected_options).to be_blank
    expect(page.work_address.selected_options).to eql(company.address.line)
    expect(page.bookers.selected_options).to be_blank
    expect(page.payroll_id.value).to be_blank
    expect(page.cost_centre.value).to be_blank
    expect(page.division.value).to be_blank

    expect(page.active).to be_checked
    expect(page.onboarding).not_to be_checked
    expect(page.receives_sms_notification).to be_checked
    expect(page.receives_email_notification).to be_checked
    expect(page.wheelchair_user).not_to be_checked
    expect(page.outlook_calendar_events).not_to be_checked

    # validate required fields can't be blank
    page.submit
    expect(page.first_name.error_message).to eql('Please add in the passengers first name')
    expect(page.last_name.error_message).to eql('Please add in the passengers last name')
    expect(page.phone.error_message).to eql('Please add in the passengers phone number')
    expect(page.email.error_message).to eql('Please add in the passengers email')

    # validate required fields doesn't allow symbols
    page.first_name.set('S{ome^nam[e')
    page.last_name.set('So}me]Last/Name')
    page.submit
    expect(page.first_name.error_message).to eql('Invalid name. Avoid using special symbols')
    expect(page.last_name.error_message).to eql('Invalid name. Avoid using special symbols')

    page.first_name.set('Some%name')
    page.last_name.set('SomeLast|Name')
    page.submit
    expect(page.first_name.error_message).to eql('Invalid name. Avoid using special symbols')
    expect(page.last_name.error_message).to eql('Invalid name. Avoid using special symbols')

    # Fill in form
    page.fill_in_form(passenger)
    page.email.set(passenger.email.upcase)
    page.department.select(department)
    page.work_role.select(work_role)
    page.home_address.select('221b Baker Street, London, UK')
    page.bookers.select(booker)
    page.payroll_id.set('RequiredPayrollID')
    page.cost_centre.set('RequiredCostCentre')
    page.division.set('Division')
    page.attach_image
    page.submit

    wait_until_true { passengers_page.loaded? }
    expect(passengers_page).to have_passengers
    record = passengers_page.get_passenger_by_email(passenger.email)
    expect(record.name).to eql(passenger.first_name)
    expect(record.surname).to eql(passenger.last_name)
    expect(record.phone_number).to match_phone(passenger.phone)
    expect(record.email).to eql(passenger.email)
    expect(record).to have_avatar
    record.open_details
    record.details.edit_button.click
    wait_until_true { edit_passenger_page.loaded? }
    expect(edit_passenger_page.onboarding).not_to be_checked

    unless role == 'Passenger'
      bookers_page.load
      wait_until_true { bookers_page.loaded? }
      expect(bookers_page).to have_bookers
      record = bookers_page.get_booker_by_email(passenger.email)
      expect(record.name).to eql(passenger.first_name)
      expect(record.surname).to eql(passenger.last_name)
      expect(record.phone_number).to eql(passenger.phone)
      expect(record.email).to eql(passenger.email)
      expect(record.role).to eql(role)
    end
  end
end

RSpec.shared_examples 'passenger can not be created by' do |role|
  it "by #{role}" do
    user_role = role.downcase.tr(' ', '').to_sym
    user = create(user_role, company: company)

    login_to_app_as(user.email)
    passengers_page.load
    wait_until_true { passengers_page.loaded? }
    expect(passengers_page).to have_no_new_passenger_button
  end
end
