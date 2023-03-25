require 'features_helper'

feature 'Passenger Favourite Addresses' do
  let(:passengers_page)     { Pages::App.passengers }
  let(:edit_passenger_page) { Pages::App.edit_passenger }
  let(:new_booking_page)    { Pages::App.new_booking }
  let(:company)             { create(:company, :enterprise) }
  let(:passenger)           { create(:passenger, company: company) }
  let(:new_address_name)    { 'favor1' }
  let(:new_address)         { '312 Vauxhall Bridge Rd' }
  let!(:existed_address)    { create(:passenger_address, :favorite, passenger: passenger, destination_message: Faker::Lorem.characters(100), pickup_message: Faker::Lorem.characters(100)) }
  let(:destination_message) { Faker::Lorem.characters(105) }
  let(:pickup_message)      { Faker::Lorem.characters(105) }

  before do
    login_to_app_as(passenger.email)
    edit_passenger_page.load(id: passenger.id)
    edit_passenger_page.favourite_addresses_tab.click
  end

  feature 'New' do
    before do
      edit_passenger_page.add_favourite_address_button.click
      expect(edit_passenger_page).to have_favourite_address_modal
    end

    scenario 'cancel saving form' do
      edit_passenger_page.favourite_address_modal.address_name.set(new_address_name)
      edit_passenger_page.favourite_address_modal.address.select(new_address)
      edit_passenger_page.favourite_address_modal.pickup_message.set(pickup_message)
      edit_passenger_page.favourite_address_modal.destination_message.set(destination_message)
      edit_passenger_page.favourite_address_modal.cancel_button.click
      edit_passenger_page.wait_until_favourite_address_modal_invisible
      expect(edit_passenger_page).to have_favourite_address(count: 1)
    end

    scenario 'successfully add' do
      edit_passenger_page.favourite_address_modal.save_button.click
      expect(edit_passenger_page.favourite_address_modal.address_name.error_message).to eql('Please add in a name for this favourite address')
      expect(edit_passenger_page.favourite_address_modal.address.error_message).to eql('Please add in a name for this favourite address')

      with_headers do
        set_address_headers new_address
        edit_passenger_page.favourite_address_modal.address.select(new_address)
      end

      edit_passenger_page.favourite_address_modal.address_name.set(existed_address.name)
      edit_passenger_page.favourite_address_modal.save_button.click
      expect(edit_passenger_page.favourite_address_modal.address_name.error_message).to eql('is already taken')

      edit_passenger_page.favourite_address_modal.address_name.set(new_address_name)
      edit_passenger_page.favourite_address_modal.pickup_message.set(pickup_message)
      edit_passenger_page.favourite_address_modal.destination_message.set(destination_message)
      edit_passenger_page.favourite_address_modal.save_button.click
      edit_passenger_page.wait_until_favourite_address_modal_invisible

      expect(edit_passenger_page).to have_favourite_address(text: new_address_name)
      created_address = edit_passenger_page.get_favourite_address_by_name(new_address_name)
      expect(created_address).to have_address(text: new_address)
      expect(created_address).to have_pickup_message(exact_text: (pickup_message)[0...100])
      expect(created_address).to have_destination_message(exact_text: (destination_message)[0...100])

      new_booking_page.load
      new_booking_page.pickup_favourite_address_icon.click
      new_booking_page.pickup_address.select(new_address_name)
      expect(new_booking_page.pickup_address.selected_options).to include(new_address)
      expect(new_booking_page).to have_message_to_driver(disabled: true, exact_text: "Pick up: #{(pickup_message)[0...100]}")

      new_booking_page.destination_favourite_address_icon.click
      new_booking_page.destination_address.select(new_address_name)

      expect(new_booking_page.destination_address.selected_options).to include(new_address)
      expect(new_booking_page).to have_message_to_driver(text: "Destination: #{(destination_message)[0.100]}")
    end
  end

  feature 'Edit' do
    before do
      record = edit_passenger_page.get_favourite_address_by_name(existed_address.name)
      record.edit_button.click
    end

    scenario 'cancel saving form' do
      edit_passenger_page.favourite_address_modal.address_name.set(new_address_name)
      edit_passenger_page.favourite_address_modal.address.select(new_address)
      edit_passenger_page.favourite_address_modal.pickup_message.set(pickup_message)
      edit_passenger_page.favourite_address_modal.destination_message.set(destination_message)
      edit_passenger_page.favourite_address_modal.cancel_button.click
      edit_passenger_page.wait_until_favourite_address_modal_invisible
      expect(edit_passenger_page).to have_favourite_address(count: 1)
      expect(edit_passenger_page.favourite_address.first).to have_address_name(text: existed_address.name)
    end

    scenario 'successfully edit existed' do
      edit_passenger_page.favourite_address_modal.address_name.set(new_address_name)
      with_headers do
        set_address_headers new_address
        edit_passenger_page.favourite_address_modal.address.select(new_address)
      end
      edit_passenger_page.favourite_address_modal.pickup_message.set(pickup_message)
      edit_passenger_page.favourite_address_modal.destination_message.set(destination_message)
      edit_passenger_page.favourite_address_modal.save_button.click
      edit_passenger_page.wait_until_favourite_address_modal_invisible

      expect(edit_passenger_page).to have_favourite_address(text: new_address_name)
      created_address = edit_passenger_page.get_favourite_address_by_name(new_address_name)
      expect(created_address).to have_address(text: new_address)
      expect(created_address).to have_pickup_message(exact_text: (pickup_message)[0...100])
      expect(created_address).to have_destination_message(exact_text: (destination_message)[0...100])
    end
  end

  feature 'Delete' do
    before do
      record = edit_passenger_page.get_favourite_address_by_name(existed_address.name)
      record.delete_button.click
    end

    scenario 'cancel deletion' do
      edit_passenger_page.delete_modal.cancel_button.click
      expect(edit_passenger_page).to have_favourite_address(count: 1)
    end

    scenario 'successfully remove existed' do
      edit_passenger_page.delete_modal.ok_button.click
      expect(edit_passenger_page).to have_text("You haven't added any favourites yet.")
    end
  end
end
