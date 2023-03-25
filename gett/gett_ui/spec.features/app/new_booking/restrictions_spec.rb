require 'features_helper'

feature 'New Booking - Restrictions' do
  let(:new_booking_page) { Pages::App.new_booking }
  let(:bookings_page)    { Pages::App.bookings }
  let(:company)          { create(:company, :enterprise) }

  feature 'for Passenger' do
    let(:user) { create(:passenger, :with_home_address, company: company) }

    scenario 'can create order only for himself' do
      login_to_app_as(user.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page).to have_no_passenger_name
      expect(new_booking_page).to have_no_phone_number

      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      new_booking_page.vehicles.wait_until_available
      new_booking_page.save_button.click

      wait_until_true { bookings_page.bookings.present? }
      expect(bookings_page).to have_bookings(count: 1, text: user.full_name)
    end

    context 'GDPR' do
      it_should_behave_like 'HOME address restrictions due to GDPR'
    end
  end

  feature 'for Booker' do
    let(:user) { create(:booker, :with_home_address, :with_work_address, company: company) }

    scenario 'can created orders for all except assigned to other' do
      unassigned_passenger = create(:passenger, company: company)
      passenger_for_booker = create(:passenger, booker_pks: [user.id], company: company)
      another_booker = create(:booker, company: company)
      passenger_for_another_booker = create(:passenger, booker_pks: [another_booker.id], company: company)

      login_to_app_as(user.email)
      expect(new_booking_page).to be_displayed

      available_passengers = new_booking_page.passenger_name.available_options
      expect(available_passengers).to include(unassigned_passenger.full_name)
      expect(available_passengers).to include(user.full_name)
      expect(available_passengers).to include(passenger_for_booker.full_name)
      expect(available_passengers).not_to include(passenger_for_another_booker.full_name)
    end

    context 'GDPR' do
      it_should_behave_like 'HOME address restrictions due to GDPR'
      it_should_behave_like 'HOME address restrictions due to GDPR for Another Passenger'
    end
  end

  feature 'for Finance' do
    let(:user) { create(:finance, :with_home_address, :with_work_address, company: company) }

    scenario 'Finance can created orders for all' do
      unassigned_passenger = create(:passenger, company: company)
      passenger_for_finance = create(:passenger, booker_pks: [user.id], company: company)
      another_finance = create(:finance, company: company)
      passenger_for_another_finance = create(:passenger, booker_pks: [another_finance.id], company: company)

      login_to_app_as(user.email)
      expect(new_booking_page).to be_displayed

      available_passengers = new_booking_page.passenger_name.available_options
      expect(available_passengers).to include(unassigned_passenger.full_name)
      expect(available_passengers).to include(user.full_name)
      expect(available_passengers).to include(passenger_for_finance.full_name)
      expect(available_passengers).to include(passenger_for_another_finance.full_name)
    end

    context 'GDPR', priority: :low do
      it_should_behave_like 'HOME address restrictions due to GDPR'
      it_should_behave_like 'HOME address restrictions due to GDPR for Another Passenger'
    end
  end

  feature 'for Travel Manager' do
    let(:user) { create(:travelmanager, :with_home_address, :with_work_address, company: company) }

    scenario 'Travel Manager can created orders for all' do
      unassigned_passenger = create(:passenger, company: company)
      passenger_for_travelmanager = create(:passenger, booker_pks: [user.id], company: company)
      another_travelmanager = create(:travelmanager, company: company)
      passenger_for_another_travelmanager = create(:passenger, booker_pks: [another_travelmanager.id], company: company)

      login_to_app_as(user.email)
      expect(new_booking_page).to be_displayed

      available_passengers = new_booking_page.passenger_name.available_options
      expect(available_passengers).to include(unassigned_passenger.full_name)
      expect(available_passengers).to include(user.full_name)
      expect(available_passengers).to include(passenger_for_travelmanager.full_name)
      expect(available_passengers).to include(passenger_for_another_travelmanager.full_name)
    end

    context 'GDPR', priority: :low do
      it_should_behave_like 'HOME address restrictions due to GDPR'
      it_should_behave_like 'HOME address restrictions due to GDPR for Another Passenger'
    end
  end

  feature 'for Admin' do
    let(:user) { create(:admin, :with_home_address, :with_work_address, company: company) }

    scenario 'Admin can created orders for all' do
      unassigned_passenger = create(:passenger, company: company)
      passenger_for_admin = create(:passenger, booker_pks: [user.id], company: company)
      another_admin = create(:admin, company: company)
      passenger_for_another_admin = create(:passenger, booker_pks: [another_admin.id], company: company)

      login_to_app_as(user.email)
      expect(new_booking_page).to be_displayed

      available_passengers = new_booking_page.passenger_name.available_options
      expect(available_passengers).to include(unassigned_passenger.full_name)
      expect(available_passengers).to include(user.full_name)
      expect(available_passengers).to include(passenger_for_admin.full_name)
      expect(available_passengers).to include(passenger_for_another_admin.full_name)
    end

    context 'GDPR', priority: :low do
      it_should_behave_like 'HOME address restrictions due to GDPR'
      it_should_behave_like 'HOME address restrictions due to GDPR for Another Passenger'
    end
  end

  feature 'for Expired Invoices' do
    include_examples 'can not create booking with existed expired invoice and payment type', 'account'
    include_examples 'can not create booking with existed expired invoice and payment type', 'company_payment_card'
  end

  feature 'for Payment Cards' do
    scenario 'Can not create new with expired Passenger Credit Card' do
      company = create(:company, :enterprise, :passenger_payment_card)
      passenger = create(:passenger, company: company)
      create(:payment_card, :expired, passenger: passenger)

      login_to_app_as(passenger.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page.payment_method.available_options(wait: false)).to be_blank
      new_booking_page.destination_address.select('221b Baker Street, London, UK')
      wait_until_true { new_booking_page.vehicles.cars_loaded? }

      new_booking_page.save_button.click
      expect(new_booking_page.payment_method.error_message).to have_text('Sorry, you have no Credit/Debit cards added in your profile')
    end

    scenario 'Can not create new without Company Payment Card for CPC company' do
      company = create(:company, :enterprise, payment_types: %w[company_payment_card], default_payment_type: 'company_payment_card')
      login_to_app_as(company.admin.email)
      expect(new_booking_page).to be_displayed

      new_booking_page.i_am_passenger.click
      new_booking_page.as_directed.click
      new_booking_page.vehicles.wait_until_available

      new_booking_page.save_button.click
      expect(new_booking_page.payment_method.error_message).to eql('Please add Credit/Debit card before ordering a taxi or contact your administrator')
    end
  end
end
