require 'features_helper'

feature 'Passenger Payment Cards' do
  let(:passengers_page)       { Pages::App.passengers }
  let(:edit_passenger_page)   { Pages::App.edit_passenger }
  let(:new_booking_page)      { Pages::App.new_booking }
  let(:company)               { create(:company, :enterprise, default_payment_type: 'passenger_payment_card') }
  let(:passenger)             { create(:passenger, company: company) }
  let!(:existed_payment_card) { create(:payment_card, :business, passenger: passenger) }

  before do
    login_to_app_as(passenger.email)
    edit_passenger_page.load(id: passenger.id)
    edit_passenger_page.payment_cards_tab.click
  end

  feature 'New card' do
    before do
      edit_passenger_page.add_payment_card_button.click
      expect(edit_passenger_page).to have_payment_card_modal
      wait_until_true { edit_passenger_page.payment_card_modal.has_card_details? }
    end

    let(:last_dec) { 1.year.from_now.strftime('12/%y') }

    scenario 'cancel saving form' do
      edit_passenger_page.payment_card_modal.populate(
        cardholder: passenger.full_name,
        expiration_date: last_dec,
        number: Faker::Lorem.characters(10),
        cvv: Faker::Number.number(3)
      )
      edit_passenger_page.payment_card_modal.cancel_button.click
      edit_passenger_page.wait_until_payment_card_modal_invisible
      expect(edit_passenger_page).to have_payment_card(count: 1)
    end

    scenario 'add, make default and verify on bookings page' do
      edit_passenger_page.payment_card_modal.save_button.click
      edit_passenger_page.payment_card_modal.save_button.click
      expect(edit_passenger_page.payment_card_modal).to have_error(text: 'Invalid card details')

      edit_passenger_page.payment_card_modal.populate(
        cardholder: passenger.full_name,
        expiration_date: last_dec,
        number: Faker::Lorem.characters(10),
        cvv: Faker::Number.number(3)
      )
      edit_passenger_page.payment_card_modal.save_button.click
      expect(edit_passenger_page.payment_card_modal).to have_error(text: 'Invalid card details')

      edit_passenger_page.payment_card_modal.populate(
        cardholder: passenger.full_name,
        expiration_date: last_dec,
        number: Faker::Lorem.characters(16),
        cvv: Faker::Lorem.word
      )
      edit_passenger_page.payment_card_modal.save_button.click
      expect(edit_passenger_page.payment_card_modal).to have_error(text: 'Invalid card details')

      edit_passenger_page.payment_card_modal.populate(
        cardholder: passenger.full_name,
        expiration_date: 1.year.from_now.strftime('15/%y'),
        number: Faker::Lorem.characters(16),
        cvv: Faker::Number.number(3)
      )

      edit_passenger_page.payment_card_modal.save_button.click
      expect(edit_passenger_page.payment_card_modal).to have_error(text: 'Invalid card details')

      edit_passenger_page.payment_card_modal.populate(
        cardholder: passenger.full_name,
        expiration_date: 1.year.from_now.strftime('%-m/%y'),
        number: Faker::Lorem.characters(16),
        cvv: Faker::Number.number(3)
      )

      edit_passenger_page.payment_card_modal.save_button.click

      pending 'No valid response'
      edit_passenger_page.wait_until_payment_card_modal_invisible

      created_card = edit_passenger_page.first_personal_card
      expect(created_card).not_to be_default
      expect(created_card).to have_type(text: 'Personal')
      expect(created_card).to have_holder_name(text: passenger.full_name)
      expect(created_card).to have_last_4(text: card_number[-4..-1])
      expect(created_card).to have_expiration_date(text: 1.year.from_now.strftime("%-m/%Y"))

      created_card.make_default
      new_booking_page.load
      expect(new_booking_page.payment_method.selected_options).to eql("Personal payment card ending with #{card_number[-4..-1]}")

      edit_passenger_page.load(id: passenger.id)
      edit_passenger_page.payment_cards_tab.click
      expect(edit_passenger_page).to have_payment_card(count: 2)
      edit_passenger_page.first_business_card.make_default
      new_booking_page.load
      expect(new_booking_page.payment_method.selected_options).to eql("Business payment card ending with #{existed_payment_card.last_4}")
    end
  end

  feature 'Deactivate existed card' do
    before do
      expect(edit_passenger_page).to have_payment_card(count: 1)
      record = edit_passenger_page.first_business_card
      record.actions.deactivate_button.click
    end

    scenario 'cancel deactivation' do
      edit_passenger_page.delete_modal.cancel_button.click
      expect(edit_passenger_page).to have_payment_card(count: 1)
    end

    scenario 'successfully deactivated card should not be visible' do
      edit_passenger_page.delete_modal.ok_button.click
      expect(edit_passenger_page).to have_text("You haven't added any credit cards yet.")
    end
  end

  scenario 'Expired card should be deactivated' do
    prev_month = Time.zone.now.prev_month
    create(:payment_card, passenger: passenger, expiration_year: prev_month.year, expiration_month: prev_month.month)

    edit_passenger_page.refresh
    edit_passenger_page.payment_cards_tab.click
    expect(edit_passenger_page).to have_payment_card(count: 2)
    record = edit_passenger_page.first_personal_card
    expect(record.actions).to have_status(text: 'Expired')

    new_booking_page.load
    wait_until_true do
      new_booking_page.payment_method.available_options == ["Account", "Business payment card ending with #{existed_payment_card.last_4}", "Cash"]
    end
  end
end
