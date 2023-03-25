require 'features_helper'

feature 'BBC Passengers List' do
  let(:auth_page)           { Pages::Auth.login }
  let(:passengers_page)     { Pages::App.passengers }
  let(:new_passenger_page)  { Pages::App.new_passenger }
  let(:edit_passenger_page) { Pages::App.edit_passenger }
  let(:company)             { create(:company, :bbc) }

  feature 'Member Permissions' do
    let!(:passenger) { create(:passenger, :bbc_full_pd, company: company) }

    scenario "Passenger can't import/export and view another passengers" do
      create(:passenger, :bbc_full_pd, company: company)
      login_to_app_as(passenger.email)

      passengers_page.load
      expect(passengers_page).to have_no_export_button
      expect(passengers_page).to have_no_import_button
      expect(passengers_page).to have_passengers(count: 1)

      expect(passengers_page).to have_total_passengers(text: 1)
      expect(passengers_page).to have_active_passengers(text: 1)
    end

    feature 'as member with role Booker I can' do
      let(:booker) { create(:booker, :bbc_full_pd, company: company) }

      scenario 'not import and export' do
        login_to_app_as(booker.email)

        passengers_page.load
        expect(passengers_page).to have_no_export_button
        expect(passengers_page).to have_no_import_button
      end

      scenario 'see passengers assigned to me' do
        assigned_passenger = create(:passenger, :bbc_full_pd, active: false, booker_pks: [booker.id], company: company)
        another_booker = create(:booker, active: false, company: company)
        another_passenger = create(:passenger, :bbc_full_pd, booker_pks: [another_booker.id], company: company)
        login_to_app_as(booker.email)

        passengers_page.load
        expect(passengers_page).to have_no_passengers(text: passenger.email)
        expect(passengers_page).to have_passengers(text: assigned_passenger.email)
        expect(passengers_page).to have_no_passengers(text: another_booker.email)
        expect(passengers_page).to have_no_passengers(text: another_passenger.email)

        expect(passengers_page).to have_total_passengers(text: 2)
        expect(passengers_page).to have_active_passengers(text: 1)
      end
    end

    feature 'as member with role Admin I can' do
      let(:admin) { create(:admin, company: company) }

      scenario 'not import and export' do
        login_to_app_as(admin.email)
        passengers_page.load

        expect(passengers_page).to have_no_export_button
        expect(passengers_page).to have_no_import_button
      end

      scenario 'see all passengers' do
        assigned_passenger = create(:passenger, :bbc_full_pd, booker_pks: [admin.id], company: company)
        another_admin = create(:admin, active: false, company: company)
        another_passenger = create(:passenger, :bbc_full_pd, booker_pks: [another_admin.id], company: company)
        login_to_app_as(admin.email)

        passengers_page.load
        expect(passengers_page).to have_passengers(text: passenger.email)
        expect(passengers_page).to have_passengers(text: assigned_passenger.email)
        expect(passengers_page).to have_passengers(text: another_admin.email)
        expect(passengers_page).to have_passengers(text: another_passenger.email)

        expect(passengers_page).to have_total_passengers(text: 6)
        expect(passengers_page).to have_active_passengers(text: 5)
      end
    end
  end

  scenario 'Stats and Diagrams' do
    passenger = create(:passenger, :bbc_full_pd, company: company)
    booker = create(:booker, active: false, company: company)
    orders_date = Time.zone.now.beginning_of_month

    Timecop.freeze(orders_date.prev_month) do
      create(:booking, :completed, :scheduled, :with_charges, fare_quote: 1500, booker: booker, passenger: passenger)
      create(:booking, :completed, :with_charges, fare_quote: 1500, passenger: passenger)
      create(:booking, :cancelled, :scheduled, :with_charges, fare_quote: 2500, passenger: passenger)
      create(:booking, :completed, :scheduled, :with_charges, fare_quote: 5500, passenger: booker)
    end

    Timecop.freeze(orders_date) do
      create(:booking, :completed, :with_charges, fare_quote: 3500, passenger: passenger)
      create(:booking, :cancelled, :with_charges, fare_quote: 500, passenger: passenger)
      create(:booking, :cancelled, :with_charges, fare_quote: 5500, passenger: booker)
    end

    login_to_app_as(passenger.email)
    passengers_page.load
    passenger_record = passengers_page.get_passenger_by_email(passenger.email)
    passenger_record.open_details
    expect(passenger_record).to have_details

    expect(passenger_record.details).to be_visible
    passenger_record.details.daily_orders_chart.hover_day(orders_date.day)
    expect(passenger_record.details.daily_orders_chart.tooltip.text).to include('Previous: 2', 'Current: 1')

    passenger_record.details.daily_spend_chart.hover_day(orders_date.day)
    expect(passenger_record.details.daily_spend_chart.tooltip.text).to include('Previous: 30', 'Current: 35')
  end
end
