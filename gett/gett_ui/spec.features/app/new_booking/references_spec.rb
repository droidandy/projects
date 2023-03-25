require 'features_helper'

feature 'New Booking - References' do
  let(:new_company_page)  { Pages::Admin.new_company }
  let(:edit_company_page) { Pages::Admin.edit_company }
  let(:companies_page)    { Pages::Admin.companies }
  let(:new_booking_page)  { Pages::App.new_booking }
  let(:bookings_page)     { Pages::App.bookings }
  let(:verify_file)       { Rails.root.join('spec.features/support/fixtures/verify_references.csv') }
  let(:dropdown_file)     { Rails.root.join('spec.features/support/fixtures/dropdown_references.csv') }
  let(:order)             { wait_for { bookings_page.bookings.first } }

  before { login_as_super_admin }

  feature 'Add new' do
    let(:company_name) { Faker::Company.name }
    let(:admin)        { build(:member) }
    let(:passenger)    { create(:passenger, cost_centre: 'SomeCostCentre', company: User.first(email: admin.email).company) }

    before do
      new_company_page.load
      expect(new_company_page).to be_loaded
      new_company_page.fill_in_ent_form(company_name, admin)
    end

    scenario 'Mandatory Options' do
      new_company_page.references.first.active.click
      new_company_page.references.first.mandatory.click
      new_company_page.references.first.cost_centre.click
      expect(new_company_page.references.first.conditional).to be_disabled
      expect(new_company_page.references.first.verify).to be_disabled
      expect(new_company_page.references.first.dropdown).to be_disabled
      expect(new_company_page.references.first.sftp_server).to be_disabled
      expect(new_company_page.references.first.name).to be_disabled

      new_company_page.references.second.active.click
      new_company_page.references.second.mandatory.click
      new_company_page.references.second.name.set('Simple Mandatory Field')
      expect(new_company_page.references.second.cost_centre).to be_disabled
      expect(new_company_page.references.second.conditional).to be_disabled
      expect(new_company_page.references.second.sftp_server).to be_disabled

      new_company_page.references.third.active.click
      new_company_page.references.third.mandatory.click
      new_company_page.references.third.verify.click
      new_company_page.references.third.name.set('Mandatory Verify Field')
      new_company_page.references.third.attachment.set(verify_file)

      expect(new_company_page.references.third.dropdown).not_to be_disabled
      expect(new_company_page.references.third.sftp_server).not_to be_disabled
      expect(new_company_page.references.third.cost_centre).to be_disabled
      expect(new_company_page.references.third.conditional).to be_disabled

      new_company_page.references.fourth.active.click
      new_company_page.references.fourth.mandatory.click
      new_company_page.references.fourth.dropdown.click
      new_company_page.references.fourth.name.set('Mandatory DropDown Field')
      new_company_page.references.fourth.attachment.set(dropdown_file)
      expect(new_company_page.references.fourth.verify).not_to be_disabled
      expect(new_company_page.references.fourth.cost_centre).to be_disabled
      expect(new_company_page.references.fourth.conditional).to be_disabled
      expect(new_company_page.references.fourth.sftp_server).not_to be_disabled

      new_company_page.submit
      wait_until_true { companies_page.loaded? }
      companies_page.logout
      login_to_app_as(admin.email)

      wait_until_true { new_booking_page.loaded? }
      new_booking_page.i_am_passenger.click

      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      new_booking_page.vehicles.wait_until_available

      expect(new_booking_page.references.first).to have_name(text: 'Cost Centre')
      expect(new_booking_page.references.second).to have_name(text: 'Simple Mandatory Field')
      expect(new_booking_page.references.third).to have_name(text: 'Mandatory Verify Field')
      expect(new_booking_page.references.fourth).to have_name(text: 'Mandatory DropDown Field')
      new_booking_page.save_button.click

      expect(new_booking_page.references.first.field.error_message).to eql('is not present')
      expect(new_booking_page.references.second.field.error_message).to eql('is not present')
      expect(new_booking_page.references.third.field.error_message).to eql('is not present')
      expect(new_booking_page.references.fourth.dropdown.error_message).to eql('is not present')

      new_booking_page.references.first.field.set('some_cost_centre')
      new_booking_page.references.second.field.set('simple')
      new_booking_page.references.third.field.set('invalid ref')
      new_booking_page.references.fourth.dropdown.select('to buy banana')
      new_booking_page.save_button.click

      expect(new_booking_page.references.third.field.error_message).to eql('reference value is invalid')
      new_booking_page.references.third.field.set('personal trip')
      new_booking_page.save_button.click

      wait_until_true(timeout: 10) { bookings_page.loaded? && !bookings_page.bookings.empty? }
      expect(bookings_page).to have_bookings(count: 1)
      order.open_details
      references = order.details.references.text
      expect(references).to include('Cost Centre: some_cost_centre')
      expect(references).to include('Simple Mandatory Field: simple')
      expect(references).to include('Mandatory Verify Field: personal trip')
      expect(references).to include('Mandatory DropDown Field: to buy banana')
    end

    scenario 'Conditional Options and pre-filled Passenger CostCentre' do
      new_company_page.references.first.active.click
      new_company_page.references.first.conditional.click
      new_company_page.references.first.cost_centre.click
      expect(new_company_page.references.first.verify).to be_disabled
      expect(new_company_page.references.first.dropdown).to be_disabled
      expect(new_company_page.references.first.name).to be_disabled

      new_company_page.references.second.active.click
      new_company_page.references.second.conditional.click
      new_company_page.references.second.name.set('Simple Mandatory Field')
      expect(new_company_page.references.second.cost_centre).to be_disabled

      new_company_page.submit
      wait_until_true { companies_page.loaded? }
      companies_page.logout
      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      new_booking_page.vehicles.wait_until_available

      expect(new_booking_page.references.first).to have_name(text: 'Cost Centre')
      expect(new_booking_page.references.second).to have_name(text: 'Simple Mandatory Field')

      new_booking_page.references.second.field.set('simple')
      expect(new_booking_page.references.first).to have_field(disabled: true)

      new_booking_page.references.second.field.clear
      expect(new_booking_page.references.first).to have_field(disabled: false)

      new_booking_page.references.first.cost_centre_link.click
      expect(new_booking_page.references.second).to have_field(disabled: true)
      expect(new_booking_page.references.first.field.value).to eql('SomeCostCentre')
      new_booking_page.save_button.click

      wait_until_true { bookings_page.loaded? && !bookings_page.bookings.empty? }
      order = bookings_page.bookings.first
      order.open_details
      references = order.details.references.text
      expect(references).to include('Cost Centre: SomeCostCentre')
    end
  end

  scenario 'Edit and Bookings Validation' do
    company = create(:company)
    create(:booking_reference, :cost_centre, company: company)
    create(:booking_reference, :mandatory, company: company)

    edit_company_page.load(id: company.id)

    expect(edit_company_page.references.first.name).to be_disabled
    expect(edit_company_page.references.first.active).to be_checked
    expect(edit_company_page.references.first.cost_centre).to be_checked
    expect(edit_company_page.references.first.conditional).not_to be_checked
    expect(edit_company_page.references.first.mandatory).not_to be_checked
    expect(edit_company_page.references.first.verify).to be_disabled
    expect(edit_company_page.references.first.dropdown).to be_disabled

    expect(edit_company_page.references.second.active).to be_checked
    expect(edit_company_page.references.second.mandatory).to be_checked
    expect(edit_company_page.references.second.conditional).to be_disabled
    expect(edit_company_page.references.second.cost_centre).to be_disabled

    edit_company_page.bookings_validation.click
    edit_company_page.references.first.cost_centre.click
    edit_company_page.references.first.active.click

    edit_company_page.references.second.mandatory.click
    edit_company_page.references.second.conditional.click

    edit_company_page.references.third.active.click
    edit_company_page.references.third.cost_centre.click
    edit_company_page.references.third.conditional.click

    edit_company_page.references.fourth.active.click
    edit_company_page.references.fourth.mandatory.click
    edit_company_page.references.fourth.verify.click
    edit_company_page.references.fourth.name.set('Mandatory Verify Field')
    edit_company_page.references.fourth.attachment.set(verify_file)

    edit_company_page.submit
    wait_until_true { companies_page.loaded? }
    companies_page.logout

    login_to_app_as(company.admin.email)
    wait_until_true { new_booking_page.loaded? }
    expect(new_booking_page).to have_no_vehicles
    expect(new_booking_page).to have_text('Please Validate Reference(s) before placing Order(s)')

    new_booking_page.continue_button.click
    expect(new_booking_page).to have_text('We are sorry but references are not validated. Bookings not allowed')

    new_booking_page.references.second.field.set('CostCentreValue')
    new_booking_page.references.third.field.set('business trip')
    expect(new_booking_page.references.first).to have_field(disabled: true)

    new_booking_page.continue_button.click
    wait_until_true { new_booking_page.loaded? }

    expect(new_booking_page).to have_no_references
    new_booking_page.i_am_passenger.click

    new_booking_page.destination_address.select('221b Baker Street, London, UK')
    new_booking_page.vehicles.wait_until_available
    new_booking_page.save_button.click

    wait_until_true(timeout: 10) { bookings_page.loaded? && !bookings_page.bookings.empty? }
    order.open_details

    references = order.details.references.text
    expect(references).to include('Cost Centre: CostCentreValue')
    expect(references).to include('Mandatory Verify Field: business trip')
  end
end
