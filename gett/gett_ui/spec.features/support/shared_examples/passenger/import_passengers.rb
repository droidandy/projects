RSpec.shared_examples 'import passengers' do
  it 'import onboarded passengers and update existed' do
    UITest.remove_user_records('dshimmin0@blogs.com')
    UITest.remove_user_records('pinsley7@nsw.gov.au')

    passenger = create(:passenger,
      company: company,
      first_name: 'Test1',
      last_name: 'Pass1',
      phone: '+1111111111',
      mobile: '+2222222222',
      email: 'dshimmin0@blogs.com',
      department_id: department.id,
      work_role_id: work_role.id,
      payroll: 'oldPayroll',
      cost_centre: 'oldCostCentre',
      division: 'oldDivision'
    )

    login_to_app_as(user.email)
    passengers_page.load
    expect(passengers_page).to be_loaded
    passengers_count = user.companyadmin? ? 2 : 3
    expect(passengers_page).to have_passengers(count: passengers_count)

    passengers_page.import_button.click
    expect(passengers_page).to have_import_modal

    passengers_page.import_modal.start_employee_on_boarding.click
    passengers_page.import_modal.set_file_for_import
    passengers_page.import_modal.import_button.click
    expect(passengers_page.import_modal).to have_text('Import employees has been completed', wait: 15)

    expect(passengers_page.import_modal).to have_created_count(text: '1')
    expect(passengers_page.import_modal).to have_updated_count(text: '1')
    expect(passengers_page.import_modal).to have_rejected_count(text: '5')

    passengers_page.import_modal.open_errors_list

    errors = passengers_page.import_modal.all_errors_list
    expect(errors).to include('Line 4: Email is invalid')
    expect(errors).to include('Line 5: First name is not present')
    expect(errors).to include('Line 6: Last name is not present')
    expect(errors).to include('Line 7: Phone Is invalid phone number or not present')
    expect(errors).to include('Line 8: Phone Is invalid phone number or not present')

    passengers_page.import_modal.close_button.click
    passengers_page.wait_until_import_modal_invisible

    updated_passengers_count = user.companyadmin? ? 3 : 4
    expect(passengers_page).to have_passengers(count: updated_passengers_count)

    edit_passenger_page.load(id: passenger.id)
    expect(edit_passenger_page).to be_loaded
    expect(edit_passenger_page.active).not_to be_checked
    expect(edit_passenger_page.onboarding).to be_checked
    expect(edit_passenger_page.first_name.value).to eql('Armstrong')
    expect(edit_passenger_page.last_name.value).to eql('Shimmin')
    expect(edit_passenger_page.phone.value).to eql('+44 7123 45678')
    expect(edit_passenger_page.mobile.value).to eql('+44 7111 22222')
    expect(edit_passenger_page.payroll_id.value).to eql('NewPayrollID')
    expect(edit_passenger_page.cost_centre.value).to eql('NewCostCentre')
    expect(edit_passenger_page.division.value).to eql('NewDivision')
    expect(edit_passenger_page.work_role.selected_options).to eql('wr2')
    expect(edit_passenger_page.department.selected_options).to eql('dept2')
    expect(edit_passenger_page.work_address.selected_options).to eql(company.address.line)

    passengers_page.load
    expect(passengers_page).to be_loaded

    imported_passenger = passengers_page.get_passenger_by_email('pinsley7@nsw.gov.au')
    imported_passenger.open_details
    imported_passenger.details.edit_button.click
    wait_until_true { edit_passenger_page.loaded? }

    expect(edit_passenger_page.active).to be_checked
    expect(edit_passenger_page.onboarding).to be_checked
    expect(edit_passenger_page.first_name.value).to eql('Price')
    expect(edit_passenger_page.last_name.value).to eql('Insley')
    expect(edit_passenger_page.phone.value).to eql('+359(189)252-1')
    expect(edit_passenger_page.mobile.value).to eql('+88 1124 0595')
    expect(edit_passenger_page.payroll_id.value).to eql('Payroll_ID_Imported')
    expect(edit_passenger_page.cost_centre.value).to eql('Cost_Centre_Imported')
    expect(edit_passenger_page.division.value).to eql('Division_Imported')
    expect(edit_passenger_page.work_role.selected_options).to eql('wr1')
    expect(edit_passenger_page.department.selected_options).to eql('dept3')
    expect(edit_passenger_page.work_address.selected_options).to eql(company.address.line)

    passengers_page.logout
    wait_until_true { auth_page.loaded? }

    activate_account_url = UITest.get_url_with_token_from_email('pinsley7@nsw.gov.au')
    visit activate_account_url
    wait_until_true { activate_account_page.loaded? }
  end
end
