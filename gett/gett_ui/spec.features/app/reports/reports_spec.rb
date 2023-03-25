require 'features_helper'

feature 'Reports - Bookings' do
  let(:bookings_page)        { Pages::App.bookings }
  let(:bookings_report_page) { Pages::App.bookings_report }
  let(:edit_booking_page)    { Pages::App.repeat_booking }

  feature 'Enterprise Company' do
    let(:company)              { create(:company, :enterprise) }

    context 'Passenger' do
      let(:user) { create(:passenger, :with_home_address, company: company) }

      scenario 'can see only his completed orders' do
        create(:booking, :cancelled, passenger: user)

        second_passenger = create(:passenger, company: company)
        create(:booking, :cancelled, passenger: second_passenger)

        login_to_app_as(user.email)
        bookings_report_page.load
        wait_until_true { bookings_report_page.loaded? }
        expect(bookings_report_page).to have_bookings(count: 1)
        order = bookings_report_page.bookings.first
        expect(order).to have_passenger(text: user.full_name)
        expect(order).to have_status(text: 'Cancelled')
      end

      it_should_behave_like 'Reports - HOME address restrictions due to GDPR'
    end

    context 'Booker' do
      let(:user) { create(:booker, :with_home_address, :with_work_address, company: company) }

      scenario 'can see orders where he is booker and orders for passengers assigned to him' do
        create(:booking, :cancelled, :without_passenger, booker: user)

        passenger_without_assignment = create(:passenger, company: company)
        create(:booking, :cancelled, passenger: passenger_without_assignment)

        passenger_with_booker = create(:passenger, booker_pks: [user.id], company: company)
        create(:booking, :cancelled, passenger: passenger_with_booker)

        another_booker = create(:booker, company: company)
        passenger_for_another_booker = create(:passenger, booker_pks: [another_booker.id], company: company)
        create(:booking, :cancelled, passenger: passenger_for_another_booker)

        login_to_app_as(user.email)
        bookings_report_page.load
        wait_until_true { bookings_report_page.loaded? }
        expect(bookings_report_page).to have_bookings(count: 2)
      end

      it_should_behave_like 'Reports - HOME address restrictions due to GDPR'
    end

    context 'Admin' do
      let(:user) { create(:admin, :with_home_address, :with_work_address, company: company) }

      scenario 'can see all completed orders' do
        booker = create(:booker, company: company)
        create(:booking, :cancelled, :without_passenger, booker: booker)

        passenger_without_assignment = create(:passenger, company: company)
        create(:booking, :cancelled, passenger: passenger_without_assignment)

        passenger_with_booker = create(:passenger, booker_pks: [booker.id], company: company)
        create(:booking, :cancelled, passenger: passenger_with_booker)

        passenger_for_admin = create(:passenger, booker_pks: [user.id], company: company)
        create(:booking, :cancelled, passenger: passenger_for_admin)

        login_to_app_as(user.email)
        bookings_report_page.load

        wait_until_true { bookings_report_page.loaded? }
        expect(bookings_report_page).to have_bookings(count: 4)
      end

      it_should_behave_like 'Reports - HOME address restrictions due to GDPR'
      it_should_behave_like 'Reports - HOME address restrictions due to GDPR for Another Passenger'
    end

    context 'Travel Manager' do
      let(:user) { create(:travelmanager, :with_home_address, :with_work_address, company: company) }

      scenario 'can see all completed orders' do
        booker = create(:booker, company: company)
        create(:booking, :cancelled, :without_passenger, booker: booker)

        passenger_without_assignment = create(:passenger, company: company)
        create(:booking, :cancelled, passenger: passenger_without_assignment)

        passenger_with_booker = create(:passenger, booker_pks: [booker.id], company: company)
        create(:booking, :cancelled, passenger: passenger_with_booker)

        passenger_for_travelmanager = create(:passenger, booker_pks: [user.id], company: company)
        create(:booking, :cancelled, passenger: passenger_for_travelmanager)

        login_to_app_as(user.email)
        bookings_report_page.load

        expect(bookings_report_page).to be_displayed
        expect(bookings_report_page).to have_bookings(count: 4)
      end

      it_should_behave_like 'Reports - HOME address restrictions due to GDPR'
      it_should_behave_like 'Reports - HOME address restrictions due to GDPR for Another Passenger'
    end
  end

  feature 'BBC Company' do
    let(:company) { create(:company, :bbc) }

    scenario 'Passenger can see only his completed orders' do
      booker = create(:booker, :bbc_full_pd, company: company)
      create(:booking, :cancelled, :without_passenger, booker: booker)

      passenger_without_assignment = create(:passenger, :bbc_full_pd, company: company)
      create(:booking, :cancelled, passenger: passenger_without_assignment)

      passenger = create(:passenger, :bbc_full_pd, company: company)
      create(:booking, :cancelled, passenger: passenger, booker: booker)
      create(:booking, :completed, passenger: passenger)

      login_to_app_as(passenger.email)
      bookings_report_page.load
      expect(bookings_report_page).not_to have_export_button(wait: 0.5)
      expect(bookings_report_page).to have_bookings(count: 2)
    end

    scenario 'Booker can see orders of all passengers assigned to him and all orders created by him' do
      booker = create(:booker, :bbc_full_pd, company: company)
      create(:booking, :cancelled, :without_passenger, booker: booker)

      passenger_without_assignment = create(:passenger, :bbc_full_pd, company: company)
      create(:booking, :cancelled, passenger: passenger_without_assignment)

      passenger_with_booker = create(:passenger, :bbc_full_pd, booker_pks: [booker.id], company: company)
      create(:booking, :cancelled, passenger: passenger_with_booker)

      another_booker = create(:booker, :bbc_full_pd, company: company)
      passenger_for_another_booker = create(:passenger, :bbc_full_pd, booker_pks: [another_booker.id], company: company)
      create(:booking, :cancelled, passenger: passenger_for_another_booker)
      create(:booking, :cancelled, :without_passenger, booker: another_booker)
      create(:booking, :cancelled, passenger: booker)

      login_to_app_as(booker.email)
      bookings_report_page.load

      wait_until_true { bookings_report_page.loaded? }
      expect(bookings_report_page).not_to have_export_button(wait: 0.5)
      expect(bookings_report_page).to have_bookings(count: 3)
    end

    scenario 'Admin can see all completed orders' do
      create(:booking, :cancelled, :without_passenger, booker: company.admin)

      passenger_without_assignment = create(:passenger, :bbc_full_pd, company: company)
      create(:booking, :cancelled, passenger: passenger_without_assignment)

      passenger_with_booker = create(:passenger, :bbc_full_pd, booker_pks: [company.admin.id], company: company)
      create(:booking, :cancelled, passenger: passenger_with_booker)

      another_booker = create(:booker, :bbc_full_pd, company: company)
      passenger_for_another_booker = create(:passenger, :bbc_full_pd, booker_pks: [another_booker.id], company: company)
      create(:booking, :cancelled, passenger: passenger_for_another_booker)
      create(:booking, :cancelled, :without_passenger, booker: another_booker)

      login_to_app_as(company.admin.email)
      bookings_report_page.load

      expect(bookings_report_page).to have_export_button
      expect(bookings_report_page).to have_bookings(count: 5)
    end
  end
end
