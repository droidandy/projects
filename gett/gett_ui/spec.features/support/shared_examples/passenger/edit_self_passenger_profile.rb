RSpec.shared_examples "edit self passenger's profile" do
  it "can edit self passenger's profile" do
    fake_passenger = build(:passenger)
    new_addresses = ['312 Vauxhall Bridge Rd', 'Acton Town Station, Gunnersbury']
    admin_user = user.executive?
    page = edit_passenger_page
    work_roles_list = work_roles.map(&:name)
    departmets_list = departments.map(&:name)

    login_to_app_as(user.email)
    passengers_page.load
    passenger_record = passengers_page.get_passenger_by_email(user.email)
    passenger_record.open_details
    passenger_record.details.edit_button.click
    wait_until_true { page.loaded? }

    expect(page).to have_no_reinvite_button

    if user.admin? || user.travelmanager?
      expect(page.role.available_options).to match_array(['Passenger', 'Booker', 'Admin', 'Finance', 'Travel Manager'])
    else
      expect(page.role).to be_disabled
    end

    if admin_user
      expect(page.active).to be_checked
      expect(page).to have_change_log_tab
    else
      expect(page).to have_email(disabled: true)
      expect(page.department).to be_disabled
      expect(page.work_role).to be_disabled
      expect(page).to have_payroll_id(disabled: true)
      expect(page).to have_cost_centre(disabled: true)
      expect(page).to have_division(disabled: true)
      expect(page).to have_no_active
      expect(page).to have_no_change_log_tab
    end
    expect(page.receives_sms_notification).to be_checked
    expect(page.receives_email_notification).to be_checked

    if user.passenger?
      expect(page.bookers).to be_disabled
    else
      available_bookers = (user.admin? || user.travelmanager?) ? [user.full_name, company.admin.full_name] : [user.full_name]
      expect(page.bookers.available_options(wait: true)).to match_array(available_bookers)
    end

    expect(page.allow_personal_card_usage).not_to be_checked
    expect(page.onboarding).not_to be_checked

    page.first_name.set(fake_passenger.first_name)
    page.last_name.set(fake_passenger.last_name)
    page.phone.set(fake_passenger.phone)
    page.bookers.select(user.full_name) unless user.passenger?
    set_address_headers new_addresses.first
    page.work_address.select(new_addresses.first)
    set_address_headers new_addresses.last
    page.home_address.select(new_addresses.last)
    page.receives_sms_notification.click
    page.receives_email_notification.click
    page.attach_image

    if admin_user
      page.email.set(fake_passenger.email.upcase)
      page.payroll_id.set('new_payroll_id')
      page.cost_centre.set('new_costcentre')
      page.division.set('new_division')
      page.work_role.select(work_roles_list.last)
      page.department.select(departmets_list.last)
    end

    page.submit

    wait_until_true { passengers_page.loaded? }
    user_email = admin_user ? fake_passenger.email : user.email
    passenger_record = passengers_page.get_passenger_by_email(user_email)
    expect(passenger_record.name).to eql(fake_passenger.first_name)
    expect(passenger_record.surname).to eql(fake_passenger.last_name)
    expect(passenger_record.phone_number).to eql(fake_passenger.phone)

    passenger_record.open_details
    passenger_record.details.edit_button.click
    wait_until_true { page.loaded? }
    expect(page.work_address.selected_options).to include(new_addresses.first)
    expect(page.home_address.selected_options).to include(new_addresses.last)
    expect(page.receives_sms_notification).not_to be_checked
    expect(page.receives_email_notification).not_to be_checked

    if admin_user
      expect(page.payroll_id.value).to eql('new_payroll_id')
      expect(page.cost_centre.value).to eql('new_costcentre')
      expect(page.division.value).to eql('new_division')
      expect(page.work_role.selected_options).to eql(work_roles_list.last)
      expect(page.department.selected_options).to eql(departmets_list.last)

      page.change_log_tab.click
      expect(page).to have_change_logs
      home_address_log = page.change_log_by_field_name('Home Address')
      expect(home_address_log).to have_author(text: user.full_name)
      expect(home_address_log).to have_from(text: '')
      expect(home_address_log).to have_to(text: new_addresses.last)
    end

    unless user.passenger?
      edit_booker_page.load(id: user.id)
      edit_booker_page.change_log_tab.click
      expect(edit_booker_page).to have_change_logs
      home_address_log = page.change_log_by_field_name('Home Address')
      expect(home_address_log).to have_to(text: new_addresses.last)
    end
  end
end
