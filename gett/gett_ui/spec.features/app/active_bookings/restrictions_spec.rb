require 'features_helper'

feature 'Active Bookings - Restrictions' do
  let(:bookings_page) { Pages::App.bookings }

  feature 'Enterprise company' do
    let(:company) { create(:company, :enterprise) }

    scenario 'Passenger can see only orders for himself' do
      passenger = create(:passenger, company: company)
      create(:booking, passenger: passenger)

      second_passenger = create(:passenger, company: company)
      create(:booking, passenger: second_passenger)

      login_to_app_as(passenger.email)
      bookings_page.load
      expect(bookings_page).to have_bookings(count: 1, text: passenger.full_name)
    end

    scenario 'Booker can see orders where he is booker and orders for passengers assigned to him' do
      booker = create(:booker, company: company)

      create(:booking, :without_passenger, booker: booker)

      passenger_without_assignment = create(:passenger, company: company)
      create(:booking, passenger: passenger_without_assignment)

      passenger_with_booker = create(:passenger, booker_pks: [booker.id], company: company)
      create(:booking, passenger: passenger_with_booker)

      another_booker = create(:booker, company: company)
      passenger_for_another_booker = create(:passenger, booker_pks: [another_booker.id], company: company)
      create(:booking, passenger: passenger_for_another_booker)
      login_to_app_as(booker.email)
      bookings_page.load
      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to have_bookings(count: 2)
    end

    scenario 'Finance can see all active orders' do
      finance = create(:finance, company: company)
      booker = create(:booker, company: company)

      create(:booking, :without_passenger, booker: booker)

      passenger_without_assignment = create(:passenger, company: company)
      create(:booking, passenger: passenger_without_assignment)

      passenger_with_booker = create(:passenger, booker_pks: [booker.id], company: company)
      create(:booking, passenger: passenger_with_booker)

      passenger_for_finance = create(:passenger, booker_pks: [finance.id], company: company)
      create(:booking, passenger: passenger_for_finance)

      login_to_app_as(finance.email)
      bookings_page.load

      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to have_bookings(count: 4)
    end

    scenario 'Admin can see all active orders' do
      admin = create(:admin, company: company)
      booker = create(:booker, company: company)

      create(:booking, :without_passenger, booker: booker)

      passenger_without_assignment = create(:passenger, company: company)
      create(:booking, passenger: passenger_without_assignment)

      passenger_with_booker = create(:passenger, booker_pks: [booker.id], company: company)
      create(:booking, passenger: passenger_with_booker)

      passenger_for_admin = create(:passenger, booker_pks: [admin.id], company: company)
      create(:booking, passenger: passenger_for_admin)

      login_to_app_as(admin.email)
      bookings_page.load

      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to have_bookings(count: 4)
    end

    scenario 'Travel Manager can see all active orders' do
      travelmanager = create(:travelmanager, company: company)
      booker = create(:booker, company: company)

      create(:booking, :without_passenger, booker: booker)

      passenger_without_assignment = create(:passenger, company: company)
      create(:booking, passenger: passenger_without_assignment)

      passenger_with_booker = create(:passenger, booker_pks: [booker.id], company: company)
      create(:booking, passenger: passenger_with_booker)

      passenger_for_travelmanager = create(:passenger, booker_pks: [travelmanager.id], company: company)
      create(:booking, passenger: passenger_for_travelmanager)

      login_to_app_as(travelmanager.email)
      bookings_page.load

      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to be_displayed
      expect(bookings_page).to have_bookings(count: 4)
    end
  end

  feature 'BBC company' do
    let(:company) { create(:company, :bbc) }

    scenario 'Passenger can see only orders for himself' do
      passenger = create(:passenger, :bbc_full_pd, company: company)
      create(:booking, passenger: passenger)

      second_passenger = create(:passenger, :bbc_full_pd, company: company)
      create(:booking, passenger: second_passenger)

      login_to_app_as(passenger.email)
      bookings_page.load
      expect(bookings_page).to have_bookings(count: 1, text: passenger.full_name)
    end

    scenario 'Booker can see orders of all passengers assigned to him and all orders created by him' do
      booker = create(:booker, :bbc_full_pd, company: company)

      create(:booking, :without_passenger, booker: booker)

      passenger_without_assignment = create(:passenger, :bbc_full_pd, company: company)
      create(:booking, passenger: passenger_without_assignment)

      passenger_with_booker = create(:passenger, :bbc_full_pd, booker_pks: [booker.id], company: company)
      create(:booking, passenger: passenger_with_booker)

      another_booker = create(:booker, :bbc_full_pd, company: company)
      passenger_for_another_booker = create(:passenger, :bbc_full_pd, booker_pks: [another_booker.id], company: company)
      create(:booking, passenger: passenger_for_another_booker)
      create(:booking, passenger: booker)

      login_to_app_as(booker.email)
      bookings_page.load
      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to have_bookings(count: 3)
    end

    scenario 'Admin can see all active orders' do
      booker = create(:booker, :bbc_full_pd, company: company)
      create(:booking, :without_passenger, booker: booker)

      passenger_without_assignment = create(:passenger, :bbc_full_pd, company: company)
      create(:booking, passenger: passenger_without_assignment)

      passenger_with_booker = create(:passenger, :bbc_full_pd, booker_pks: [booker.id], company: company)
      create(:booking, passenger: passenger_with_booker)

      passenger_for_admin = create(:passenger, :bbc_full_pd, booker_pks: [company.admin.id], company: company)
      create(:booking, passenger: passenger_for_admin)

      login_to_app_as(company.admin.email)
      bookings_page.load

      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to have_bookings(count: 4)
    end
  end
end
