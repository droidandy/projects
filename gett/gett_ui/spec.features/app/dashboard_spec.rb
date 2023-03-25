require 'features_helper'

feature 'Dashboard' do
  let(:dashboard_page) { Pages::App.dashboard }
  let(:company)        { create(:company, :enterprise) }

  scenario 'Passenger can see only his completed orders' do
    booker = create(:booker, company: company)
    unassigned_pass = create(:passenger, :with_payment_cards, allow_personal_card_usage: true, company: company)
    pass_for_booker = create(:passenger, :with_payment_cards, booker_pks: [booker.id], company: company)
    pass_for_admin = create(:passenger, :with_payment_cards, booker_pks: [company.admin.id], company: company)

    Timecop.freeze(Time.current.prev_month) do
      create(:booking, :completed, :with_charges, :ot, :without_passenger, booker: booker)
      create(:booking, :completed, :with_charges, :reincarnated, :gett, :without_passenger, booker: company.admin)
      create(:booking, :completed, :with_charges, :scheduled, :ot, passenger: pass_for_booker, booker: booker)
      create(:booking, :completed, :with_charges, :personal_card, :gett, passenger: pass_for_booker)
      create(:booking, :completed, :with_charges, :business_card, :scheduled, passenger: pass_for_admin, booker: company.admin)
      create(:booking, :completed, :with_charges, :ot, :cash, passenger: pass_for_admin)
      create(:booking, :completed, :with_charges, :cash, :ot, passenger: unassigned_pass)
      create(:booking, :completed, :with_charges, :gett, :personal_card, passenger: unassigned_pass, booker: booker)
      create(:booking, :cancelled, :with_charges, :gett, passenger: unassigned_pass, booker: company.admin)
      create(:booking, :cancelled, :with_charges, international: true, passenger: booker)
      create(:booking, :rejected, :cash, :ot, passenger: company.admin)
    end

    create(:booking, :creating, :ot, :scheduled, :without_passenger, booker: booker)
    create(:booking, :order_received, :reincarnated, :gett, :without_passenger, booker: company.admin)
    create(:booking, :locating, :ot, passenger: pass_for_booker, booker: booker)
    create(:booking, :on_the_way, :personal_card, :gett, passenger: pass_for_booker)
    create(:booking, :arrived, :business_card, :gett, passenger: pass_for_admin, booker: company.admin)
    create(:booking, :in_progress, :ot, :cash, passenger: pass_for_admin)
    create(:booking, :in_progress, :personal_card, :ot, passenger: unassigned_pass)
    create(:booking, :completed, :with_charges, :gett, passenger: unassigned_pass, booker: booker)
    create(:booking, :cancelled, :gett, :personal_card, passenger: unassigned_pass, booker: company.admin)
    create(:booking, :completed, international: true, passenger: booker)
    create(:booking, :customer_care, :ot, passenger: company.admin)

    login_to_app_as(company.admin.email)
    dashboard_page.load
    BM.sleep 2 # give time for charts to be fully rendered

    dashboard_page.monthly_completed_cancelled_orders_chart.first_month.hover
    expect(dashboard_page.monthly_completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 2', 'Completed: 7')
    dashboard_page.monthly_completed_cancelled_orders_chart.last_month.hover
    expect(dashboard_page.monthly_completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 1', 'Completed: 2')

    expect(dashboard_page).to have_total_number_of_booking_taken(text: '19')
    expect(dashboard_page).to have_total_spend(text: '£152')
    expect(dashboard_page).to have_number_of_living_bookings(text: '4')
    expect(dashboard_page).to have_number_of_future_orders(text: '1')

    dashboard_page.logout
    login_to_app_as(booker.email)
    dashboard_page.load
    BM.sleep 2 # give time for charts to be fully rendered

    dashboard_page.monthly_completed_cancelled_orders_chart.first_month.hover
    expect(dashboard_page.monthly_completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 1', 'Completed: 2')
    dashboard_page.monthly_completed_cancelled_orders_chart.last_month.hover
    expect(dashboard_page.monthly_completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 0', 'Completed: 2')

    expect(dashboard_page).to have_total_number_of_booking_taken(text: '7')
    expect(dashboard_page).to have_total_spend(text: '£57')
    expect(dashboard_page).to have_number_of_living_bookings(text: '1')
    expect(dashboard_page).to have_number_of_future_orders(text: '0')

    dashboard_page.logout
    login_to_app_as(unassigned_pass.email)
    dashboard_page.load
    BM.sleep 2 # give time for charts to be fully rendered

    dashboard_page.monthly_completed_cancelled_orders_chart.first_month.hover
    expect(dashboard_page.monthly_completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 1', 'Completed: 2')
    dashboard_page.monthly_completed_cancelled_orders_chart.last_month.hover
    expect(dashboard_page.monthly_completed_cancelled_orders_chart.tooltip.text).to include('Cancelled: 1', 'Completed: 1')

    expect(dashboard_page).to have_total_number_of_booking_taken(text: '6')
    expect(dashboard_page).to have_total_spend(text: '£57')
    expect(dashboard_page).to have_number_of_living_bookings(text: '1')
    expect(dashboard_page).to have_number_of_future_orders(text: '0')
  end
end
