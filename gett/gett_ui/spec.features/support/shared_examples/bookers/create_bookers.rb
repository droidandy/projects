RSpec.shared_examples 'create booker with role' do |role|
  it "create booker with role #{role}" do
    if company.enterprise?
      department = create_list(:department, 4, company: company).sample.name
      work_role = create_list(:work_role, 4, company: company).sample.name
      passenger = create_list(:passenger, 4, company: company).sample
    end
    page = new_booker_page

    company.enterprise? ? login_to_app_as(user.email) : login_to_affiliate_as(user.email)
    bookers_page.load
    bookers_page.new_booker_button.click
    wait_until_true { page.loaded? }

    # default selected Role is 'booker'
    expect(page.role.selected_options).to eql('Booker')
    page.role.select(role)

    # validate initial form fields
    if company.enterprise?
      expect(page.department.selected_options).to be_blank
      expect(page.work_role.selected_options).to be_blank
      expect(page.passengers.selected_options).to be_blank
      expect(page.onboarding).not_to be_checked
    end
    expect(page.active).to be_checked

    # validate required fields
    page.submit
    expect(page.first_name.error_message).to eql("Please fill in the first name")
    expect(page.last_name.error_message).to eql("Please fill in the last name")
    expect(page.phone.error_message).to eql("Please fill in the phone number")
    expect(page.email.error_message).to eql("Please fill in the email")

    page.phone.set('+013127773655')
    expect(page.phone.error_message).to eql('Invalid phone format. Phone should start with country dial code')
    page.phone.set('+3800953838388')
    expect(page.phone.error_message).to eql('Invalid phone format. Please remove 0 after country dial code')

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
    page.fill_in_form(booker)
    page.email.set(booker.email.upcase)

    if company.enterprise?
      page.department.select(department)
      page.work_role.select(work_role)
      page.passengers.select(passenger.full_name)
    end

    page.attach_image
    page.submit

    # Verify new created booker
    wait_until_true { bookers_page.loaded? }
    expect(bookers_page).to have_bookers
    record = bookers_page.get_booker_by_email(booker.email)
    expect(record.name).to eql(booker.first_name)
    expect(record.surname).to eql(booker.last_name)
    expect(record.phone_number).to eql(booker.phone)
    expect(record.email).to eql(booker.email)
    expect(record.role).to eql(role)

    if company.enterprise?
      # Verify that new created booker also displayed as passenger on Passengers page
      passengers_page.load
      wait_until_true { passengers_page.loaded? }
      expect(passengers_page).to have_passengers
      record = passengers_page.get_passenger_by_email(booker.email)
      expect(record.name).to eql(booker.first_name)
      expect(record.surname).to eql(booker.last_name)
      expect(record.phone_number).to eql(booker.phone)
      expect(record.email).to eql(booker.email)
      expect(record).to have_avatar

      # Verify that selected passenger is attached to new booker
      edit_passenger_page.load(id: passenger.id)
      wait_until_true { edit_passenger_page.loaded? }
      expect(edit_passenger_page.bookers.selected_options).to include(booker.full_name)
    end
  end
end

RSpec.shared_examples 'booker can not be created by' do |role|
  it role.to_s do
    user_role = role.downcase.tr(' ', '').to_sym
    user = create(user_role, company: company)

    company.enterprise? ? login_to_app_as(user.email) : login_to_affiliate_as(user.email)
    bookers_page.load
    wait_until_true { bookers_page.loaded? }
    expect(bookers_page).to have_no_new_booker_button
  end
end
