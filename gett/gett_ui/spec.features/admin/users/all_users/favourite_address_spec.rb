require 'features_helper'

feature 'User Favourite Addresses', priority: :low do
  let(:edit_user_page)      { Pages::Admin.edit_user }
  let(:company)             { create(:company, :enterprise) }
  let(:passenger)           { create(:passenger, company: company) }
  let(:new_address_name)    { 'favor1' }
  let(:new_address)         { '312 Vauxhall Bridge Rd' }
  let!(:existed_address)    { create(:passenger_address, :favorite, passenger: passenger, destination_message: Faker::Lorem.characters(100), pickup_message: Faker::Lorem.characters(100)) }
  let(:destination_message) { Faker::Lorem.characters(105) }
  let(:pickup_message)      { Faker::Lorem.characters(105) }

  before do
    login_as_super_admin
    edit_user_page.load(id: passenger.id)
    edit_user_page.favourite_addresses_tab.click
  end

  scenario 'Add New' do
    edit_user_page.add_favourite_address_button.click
    expect(edit_user_page).to have_favourite_address_modal

    edit_user_page.favourite_address_modal.save_button.click
    expect(edit_user_page.favourite_address_modal.address_name.error_message).to eql('Please add in a name for this favourite address')
    expect(edit_user_page.favourite_address_modal.address.error_message).to eql('Please add in a name for this favourite address')

    with_headers do
      set_address_headers new_address
      edit_user_page.favourite_address_modal.address.select(new_address)
    end

    edit_user_page.favourite_address_modal.address_name.set(existed_address.name)
    edit_user_page.favourite_address_modal.save_button.click
    expect(edit_user_page.favourite_address_modal.address_name.error_message).to eql('is already taken')

    edit_user_page.favourite_address_modal.address_name.set(new_address_name)
    edit_user_page.favourite_address_modal.pickup_message.set(pickup_message)
    edit_user_page.favourite_address_modal.destination_message.set(destination_message)
    edit_user_page.favourite_address_modal.save_button.click
    edit_user_page.wait_until_favourite_address_modal_invisible

    expect(edit_user_page).to have_favourite_address(text: new_address_name)
    created_address = edit_user_page.get_favourite_address_by_name(new_address_name)
    expect(created_address).to have_address(text: new_address)
    expect(created_address).to have_pickup_message(exact_text: (pickup_message)[0...100])
    expect(created_address).to have_destination_message(exact_text: (destination_message)[0...100])
  end

  scenario 'Edit existed' do
    record = edit_user_page.get_favourite_address_by_name(existed_address.name)
    record.edit_button.click
    edit_user_page.favourite_address_modal.address_name.set(new_address_name)
    with_headers do
      set_address_headers new_address
      edit_user_page.favourite_address_modal.address.select(new_address)
    end
    edit_user_page.favourite_address_modal.pickup_message.set(pickup_message)
    edit_user_page.favourite_address_modal.destination_message.set(destination_message)
    edit_user_page.favourite_address_modal.save_button.click
    edit_user_page.wait_until_favourite_address_modal_invisible

    expect(edit_user_page).to have_favourite_address(text: new_address_name)
    created_address = edit_user_page.get_favourite_address_by_name(new_address_name)
    expect(created_address).to have_address(text: new_address)
    expect(created_address).to have_pickup_message(exact_text: (pickup_message)[0...100])
    expect(created_address).to have_destination_message(exact_text: (destination_message)[0...100])
  end

  scenario 'Delete existed' do
    record = edit_user_page.get_favourite_address_by_name(existed_address.name)
    record.delete_button.click
    edit_user_page.delete_modal.ok_button.click
    expect(edit_user_page).to have_text("You haven't added any favourites yet.")
  end
end
