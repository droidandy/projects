RSpec.shared_examples 'create bbc passenger with category' do |category|
  it "create bbc passenger with role #{category}" do
    categorisation = category.include?('PD') ? 'Staff' : 'Freelancer'
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

    # validate initial form fields
    expect(page.department.selected_options).to be_blank
    expect(page.work_role.selected_options).to be_blank
    expect(page.passenger_categorisation.selected_options).to be_blank
    expect(page.home_address).to be_disabled
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
    expect(page).to have_no_enable_travel_to_from_home
    expect(page).to have_no_exemption_ww_salary_charges

    # validate required fields can't be blank
    page.submit
    expect(page.first_name.error_message).to eql('Please add in the passengers first name')
    expect(page.last_name.error_message).to eql('Please add in the passengers last name')
    expect(page.phone.error_message).to eql('Please add in the passengers phone number')
    expect(page.email.error_message).to eql('Please add in the passengers email')
    expect(page.passenger_categorisation.error_message).to eql("can't be blank")

    # Fill in form
    page.fill_in_form(passenger)
    page.email.set(passenger.email.upcase)
    page.department.select(department)
    page.work_role.select(work_role)
    page.passenger_categorisation.select(categorisation)
    page.bookers.select(booker)
    page.payroll_id.set('RequiredPayrollID')
    page.cost_centre.set('RequiredCostCentre')
    page.division.set('Division')

    unless category == 'Freelancer'
      expect(page).to have_enable_travel_to_from_home
      expect(page).to have_exemption_ww_salary_charges
    end

    if category == 'FullPD'
      page.enable_travel_to_from_home.click
      expect(page.home_address).not_to be_disabled
      page.home_address.select('312 Vauxhall Bridge Rd')

      expect(page).to have_exemption_p11d
      expect(page).to have_exemption_wh_hw_salary_charges
      expect(page).to have_hw_exemption_time_from
      expect(page).to have_hw_exemption_time_to
      expect(page).to have_wh_exemption_time_from
      expect(page).to have_wh_exemption_time_to
    end

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
    expect(edit_passenger_page.passenger_categorisation.selected_options).to eql(categorisation)
    expect(edit_passenger_page.department.selected_options).to eql(department)
    expect(edit_passenger_page.work_role.selected_options).to eql(work_role)
    expect(edit_passenger_page.bookers.selected_options).to eql([booker])
    expect(edit_passenger_page).to have_pd_expiry_date(text: (Time.current + 29.days).strftime('%d/%m/%Y')) unless category == 'Freelancer'
  end
end

RSpec.shared_examples 'bbc passenger can not be created by' do |role|
  it "by #{role}" do
    user_role = role.downcase.tr(' ', '').to_sym
    user = create(user_role, :bbc_staff, company: company)

    login_to_app_as(user.email)
    passengers_page.load
    wait_until_true { passengers_page.loaded? }
    expect(passengers_page).to have_no_new_passenger_button
  end
end
