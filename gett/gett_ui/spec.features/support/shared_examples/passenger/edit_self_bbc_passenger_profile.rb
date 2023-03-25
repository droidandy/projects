RSpec.shared_examples "edit self BBC passenger's profile" do
  it "can edit self BBC passenger's profile" do
    fake_passenger = build(:passenger)
    passenger_roles = ['Passenger', 'Booker', 'Admin', 'Finance', 'Travel Manager']
    new_addresses = ['312 Vauxhall Bridge Rd', 'Acton Town Station, Gunnersbury']
    page = edit_passenger_page
    work_roles_list = work_roles.map(&:name)
    departmets_list = departments.map(&:name)

    login_to_app_as(user.email)
    passengers_page.load
    passenger_record = passengers_page.get_passenger_by_email(user.email)
    passenger_record.open_details
    passenger_record.details.edit_button.click
    wait_until_true { page.loaded? }

    # Tabs visibility
    expect(page).to have_favourite_addresses_tab
    expect(page).to have_advanced_options_tab
    expect(page).to have_no_change_log_tab
    expect(page).to have_no_payment_cards_tab

    # Form elements visibility
    expect(page).to have_no_reinvite_button
    expect(page).to have_no_active
    expect(page).to have_no_allow_personal_card_usage
    expect(page.onboarding).not_to be_checked
    expect(page.receives_sms_notification).to be_checked
    expect(page.receives_email_notification).to be_checked
    expect(page.receives_push_notification).to be_checked

    if user.admin?
      expect(page).to have_active
      expect(page.wheelchair_user).not_to be_disabled
    else
      expect(page.wheelchair_user).to be_disabled
    end

    if user.bbc_freelancer?
      expect(page.home_address).to be_disabled

      expect(page).to have_no_enable_travel_to_from_home
      expect(page).to have_no_exemption_p11d
      expect(page).to have_no_exemption_ww_salary_charges
      expect(page).to have_no_exemption_wh_hw_salary_charges
      expect(page).to have_no_hw_exemption_time_from
      expect(page).to have_no_hw_exemption_time_to
      expect(page).to have_no_wh_exemption_time_from
      expect(page).to have_no_wh_exemption_time_to
      expect(page).to have_no_pd_expiry_date
      expect(page).to have_no_excess_mileage

      expect(page).to have_no_passenger_declaration
      expect(page).to have_no_accept_declaration
    elsif user.bbc_thin?
      expect(page.home_address).to be_disabled

      expect(page.enable_travel_to_from_home).not_to be_disabled
      expect(page.enable_travel_to_from_home).not_to be_checked

      expect(page.exemption_ww_salary_charges).to be_disabled
      expect(page.exemption_ww_salary_charges).not_to be_checked

      expect(page).to have_no_exemption_p11d
      expect(page).to have_no_exemption_wh_hw_salary_charges
      expect(page).to have_no_hw_exemption_time_from
      expect(page).to have_no_hw_exemption_time_to
      expect(page).to have_no_wh_exemption_time_from
      expect(page).to have_no_wh_exemption_time_to
      expect(page).to have_pd_expiry_date
      expect(page).to have_no_excess_mileage

      expect(page).to have_passenger_declaration
      expect(page.accept_declaration).to be_checked
    elsif user.bbc_full?
      expect(page.home_address).not_to be_disabled

      expect(page.enable_travel_to_from_home).not_to be_disabled
      expect(page.enable_travel_to_from_home).to be_checked

      expect(page.exemption_p11d).to be_disabled
      expect(page.exemption_ww_salary_charges).to be_disabled
      expect(page.exemption_wh_hw_salary_charges).to be_disabled
      expect(page.hw_exemption_time_from).to be_disabled
      expect(page.hw_exemption_time_to).to be_disabled
      expect(page.wh_exemption_time_from).to be_disabled
      expect(page.wh_exemption_time_to).to be_disabled
      expect(page).to have_no_excess_mileage
      expect(page).to have_pd_expiry_date(text: (Time.current + 1.year).strftime('%d/%m/%Y'))
      expect(page).to have_passenger_declaration
      expect(page.accept_declaration).to be_checked
    end

    if user.admin?
      expect(page.role.available_options).to match_array(passenger_roles)
      expect(page.passenger_categorisation.available_options).to match_array(%w(Freelancer Staff))
    else
      expect(page.role).to be_disabled
      expect(page.passenger_categorisation).to be_disabled
    end

    # TODO: uncomment when bug will be fixed
    # available_bookers = (user.admin? || user.travelmanager?) ? [user.full_name, company.admin.full_name] : [user.full_name]
    # expect(page.bookers.available_options).to match_array(available_bookers)

    page.first_name.set(fake_passenger.first_name)
    page.last_name.set(fake_passenger.last_name)
    page.email.set(fake_passenger.email.upcase)
    page.phone.set(fake_passenger.phone)
    page.payroll_id.set('new_payroll_id')
    page.cost_centre.set('new_costcentre')
    page.division.set('new_division')
    page.work_role.select(work_roles_list.last)
    page.department.select(departmets_list.last)
    # TODO: uncomment when bug will be fixed
    # page.bookers.select(user.full_name) unless user.passenger?
    with_headers do
      set_address_headers new_addresses.first
      page.work_address.select(new_addresses.first)
    end

    if user.bbc_full?
      with_headers do
        set_address_headers new_addresses.last
        page.home_address.select(new_addresses.last)
      end
    end
    page.attach_image

    unless user.bbc_freelancer?
      expect(page.accept_declaration).not_to be_checked
      page.accept_declaration.click
    end

    page.submit

    wait_until_true { passengers_page.loaded? }
    passenger_record = passengers_page.get_passenger_by_email(fake_passenger.email)
    expect(passenger_record.name).to eql(fake_passenger.first_name)
    expect(passenger_record.surname).to eql(fake_passenger.last_name)
    expect(passenger_record.phone_number).to match_phone(fake_passenger.phone)

    passenger_record.open_details
    passenger_record.details.edit_button.click
    wait_until_true { page.loaded? }
    expect(page.work_address.selected_options).to include(new_addresses.first)
    expect(page.home_address.selected_options).to include(new_addresses.last) if user.bbc_full?
    expect(page.payroll_id.value).to eql('new_payroll_id')
    expect(page.cost_centre.value).to eql('new_costcentre')
    expect(page.division.value).to eql('new_division')
    expect(page.work_role.selected_options).to eql(work_roles_list.last)
    expect(page.department.selected_options).to eql(departmets_list.last)
    # TODO: uncomment when bug will be fixed
    # expect(page.bookers.selected_options).to eql(user.full_name)
  end
end
