RSpec.shared_examples 'edit profile for passenger' do
  let!(:passenger)  { create(:passenger, company: company) }
  let(:manage_user) { false }
  it 'can edit profile for another passenger' do
    fake_passenger = build(:passenger)
    new_addresses = ['312 Vauxhall Bridge Rd', 'Acton Town Station, Gunnersbury']
    admin_user = user.executive?
    page = edit_passenger_page
    work_roles_list = work_roles.map(&:name)
    departmets_list = departments.map(&:name)

    login_to_app_as(user.email)
    passengers_page.load
    passenger_record = wait_for{ passengers_page.get_passenger_by_email(passenger.email) }
    passenger_record.open_details
    passenger_record.details.edit_button.click
    wait_until_true { page.loaded? }

    expect(page).to have_reinvite_button

    if admin_user
      expect(page.role.available_options).to match_array(['Passenger', 'Booker', 'Admin', 'Finance', 'Travel Manager'])
      expect(page.active).to be_checked
      expect(page).to have_change_log_tab
    else
      expect(page.role).to be_disabled
      expect(page).to have_email(disabled: true)
      expect(page.department).to be_disabled
      expect(page.work_role).to be_disabled
      expect(page).to have_payroll_id(disabled: true)
      expect(page).to have_cost_centre(disabled: true)
      expect(page).to have_division(disabled: true)
      if manage_user
        expect(page.active).to be_checked
      else
        expect(page).to have_no_active
      end
      expect(page.receives_sms_notification).to be_checked
      expect(page.receives_email_notification).to be_checked
      expect(page).to have_no_change_log_tab
    end

    available_bookers = (user.admin? || user.travelmanager?) ? [user.full_name, company.admin.full_name] : [user.full_name]
    expect(page.bookers.available_options).to match_array(available_bookers)

    expect(page).to have_no_allow_personal_card_usage
    expect(page.onboarding).not_to be_checked

    page.first_name.set(fake_passenger.first_name)
    page.last_name.set(fake_passenger.last_name)

    page.phone.set('+013127773655')
    page.submit
    expect(page.phone.error_message).to eql('Invalid phone format. Phone should start with country dial code')
    page.phone.set('+3800953838388')
    expect(page.phone.error_message).to eql('Invalid phone format. Please remove 0 after country dial code')

    page.phone.set(fake_passenger.phone)
    page.bookers.select(user.full_name) unless user.passenger?
    with_headers do
      set_address_headers new_addresses.first
      page.work_address.select(new_addresses.first)
      set_address_headers new_addresses.last
      page.home_address.select(new_addresses.last)
    end
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
    user_email = admin_user ? fake_passenger.email : passenger.email
    passenger_record = passengers_page.get_passenger_by_email(user_email)
    expect(passenger_record.name).to eql(fake_passenger.first_name)
    expect(passenger_record.surname).to eql(fake_passenger.last_name)
    expect(passenger_record.phone_number).to eql(fake_passenger.phone)

    passenger_record.open_details
    passenger_record.details.edit_button.click
    wait_until_true { page.loaded? }
    expect(page.work_address.selected_options).to include(new_addresses.first)
    expect(page.home_address.selected_options).to include('Home')
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

      work_role_log = page.change_log_by_field_name('Work Role')
      expect(work_role_log).to have_author(text: user.full_name)
      expect(work_role_log).to have_from(text: '')
      expect(work_role_log).to have_to(text: work_roles_list.last)

      work_address_log = page.change_log_by_field_name('Work Address')
      expect(work_address_log).to have_author(text: user.full_name)
      expect(work_address_log).to have_from(text: '')
      expect(work_address_log).to have_to(text: new_addresses.first)

      phone_log = page.change_log_by_field_name('Phone')
      expect(phone_log).to have_author(text: user.full_name)
      expect(phone_log).to have_from(text: passenger.phone)
      expect(phone_log).to have_to(text: fake_passenger.phone)

      payroll_log = page.change_log_by_field_name('Payroll')
      expect(payroll_log).to have_author(text: user.full_name)
      expect(payroll_log).to have_from(text: '')
      expect(payroll_log).to have_to(text: 'new_payroll_id')

      sms_notify_log = page.change_log_by_field_name('Notify With Sms')
      expect(sms_notify_log).to have_author(text: user.full_name)
      expect(sms_notify_log).to have_from(text: 'True')
      expect(sms_notify_log).to have_to(text: '')

      email_notify_log = page.change_log_by_field_name('Notify With Email')
      expect(email_notify_log).to have_author(text: user.full_name)
      expect(email_notify_log).to have_from(text: 'True')
      expect(email_notify_log).to have_to(text: '')

      last_name_log = page.change_log_by_field_name('Last Name')
      expect(last_name_log).to have_author(text: user.full_name)
      expect(last_name_log).to have_from(text: passenger.last_name)
      expect(last_name_log).to have_to(text: fake_passenger.last_name)

      home_address_log = page.change_log_by_field_name('Home Address')
      expect(home_address_log).to have_author(text: user.full_name)
      expect(home_address_log).to have_from(text: '')
      expect(home_address_log).to have_to(text: 'Home')

      first_name_log = page.change_log_by_field_name('First Name')
      expect(first_name_log).to have_author(text: user.full_name)
      expect(first_name_log).to have_from(text: passenger.first_name)
      expect(first_name_log).to have_to(text: fake_passenger.first_name)

      email_log = page.change_log_by_field_name('Email')
      expect(email_log).to have_author(text: user.full_name)
      expect(email_log).to have_from(text: passenger.email)
      expect(email_log).to have_to(text: fake_passenger.email)

      page.pagination.select_page(2)

      division_log = page.change_log_by_field_name('Division')
      expect(division_log).to have_author(text: user.full_name)
      expect(division_log).to have_from(text: '')
      expect(division_log).to have_to(text: 'new_division')

      department_log = page.change_log_by_field_name('Department')
      expect(department_log).to have_author(text: user.full_name)
      expect(department_log).to have_from(text: '')
      expect(department_log).to have_to(text: departmets_list.last)

      cost_centre_log = page.change_log_by_field_name('Cost Centre')
      expect(cost_centre_log).to have_author(text: user.full_name)
      expect(cost_centre_log).to have_from(text: '')
      expect(cost_centre_log).to have_to(text: 'new_costcentre')

      bookers_log = page.change_log_by_field_name('Bookers')
      expect(bookers_log).to have_author(text: user.full_name)
      expect(bookers_log).to have_from(text: '')
      expect(bookers_log).to have_to(text: user.full_name)
    end
  end
end
