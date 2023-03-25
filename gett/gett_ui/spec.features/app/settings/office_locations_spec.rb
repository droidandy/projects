require 'features_helper'

feature 'Office Locations' do
  let(:ol_page)             { Pages::App.office_locations }
  let(:new_booking_page)    { Pages::App.new_booking }
  let(:company)             { create(:company, :enterprise) }
  let(:address)             { create(:address, :baker_street) }
  let!(:existed_location)   { create(:location, company: company, address: address) }
  let(:new_name)            { 'VauxOffice' }
  let(:new_address)         { '312 Vauxhall Bridge Rd' }
  let(:pickup_message)      { Faker::Lorem.characters }
  let(:destination_message) { Faker::Lorem.characters }

  before do
    login_to_app_as(company.admin.email)
  end

  scenario 'Create' do
    wait_until_true { new_booking_page.loaded? }
    expect(new_booking_page.pickup_address.selected_options).to eql(company.address.line)

    ol_page.load
    expect(ol_page).to be_loaded
    ol_page.add_office_location_button.click
    ol_page.wait_until_location_form_visible

    form = ol_page.location_form
    expect(form).to have_name(text: "")
    form.save_button.click
    expect(form.name.error_message).to eql("can't be blank")
    expect(form.address.error_message).to eql("can't be blank")

    form.name.set(existed_location.name)
    with_headers do
      set_mock_header google_maps: { details: { lat: address.lat, lng: address.lng } }
      form.address.select('221b Baker Street, London, UK')
    end
    form.save_button.click

    expect(form.name.error_message).to eql("is already taken")
    # expect(form.address.error_message).to eql("is already taken")

    form.name.set(new_name)
    with_headers do
      set_address_headers new_address
      form.address.select(new_address)
    end
    form.pickup_message.set(pickup_message)
    form.destination_message.set(destination_message)

    form.save_button.click

    ol_page.wait_until_location_form_invisible
    expect(ol_page).to have_locations(count: 2)

    created_location = ol_page.get_location_by_name(new_name)
    expect(created_location.default).not_to be_checked
    created_location.default.click
    expect(created_location).to have_address(text: new_address)
    expect(created_location).to have_pickup_message(exact_text: pickup_message[0...100])
    expect(created_location).to have_destination_message(exact_text: destination_message[0...100])
    expect(created_location.default).to be_checked

    new_booking_page.load
    expect(new_booking_page).to be_loaded
    wait_until_true { new_booking_page.pickup_address.selected_options.present? }
    expect(new_booking_page.pickup_address.selected_options).to include(new_address)
    expect(new_booking_page).to have_message_to_driver(disabled: true, exact_text: "Pick up: #{pickup_message[0...100]}", wait: 2)

    new_booking_page.pickup_office_location_icon.click
    new_booking_page.pickup_address.select(existed_location.name)
    expect(new_booking_page.pickup_address.selected_options).to include(existed_location.address.line)

    new_booking_page.destination_office_location_icon.click
    new_booking_page.destination_address.select(new_name)
    expect(new_booking_page.destination_address.selected_options).to include(new_address)
    expect(new_booking_page).to have_message_to_driver(disabled: true, exact_text: "Destination: #{destination_message[0...100]}", wait: 2)
  end

  scenario 'Edit' do
    ol_page.load
    wait_until_true { ol_page.locations.present? }
    record = ol_page.get_location_by_name(existed_location.name)
    record.edit_button.click

    ol_page.wait_until_location_form_visible
    form = ol_page.location_form

    form.name.set(new_name)
    set_address_headers new_address
    form.address.select(new_address)
    form.pickup_message.set(pickup_message)
    form.destination_message.set(destination_message)
    form.save_button.click

    ol_page.wait_until_location_form_invisible
    expect(ol_page).to have_locations(count: 1)

    created_location = ol_page.get_location_by_name(new_name)
    expect(created_location).to have_address(text: new_address)
    expect(created_location).to have_pickup_message(exact_text: pickup_message[0...100])
    expect(created_location).to have_destination_message(exact_text: destination_message[0...100])
    expect(created_location.default).not_to be_checked
  end

  scenario 'Delete' do
    ol_page.load
    wait_until_true { ol_page.locations.present? }
    record = ol_page.get_location_by_name(existed_location.name)
    record.delete_button.click
    ol_page.delete_modal.ok_button.click
    expect(ol_page).to have_no_locations(wait: 3)
  end
end
