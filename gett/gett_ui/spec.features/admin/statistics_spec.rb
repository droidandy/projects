require 'features_helper'

feature 'Statistics' do
  let(:statistic_page) { Pages::Admin.statistics }
  let(:ent_company)    { create(:company, :enterprise, payment_types: %w(account passenger_payment_card cash)) }
  let(:aff_company)    { create(:company, :affiliate) }
  let(:ent_pass1)      { create(:passenger, company: ent_company) }
  let(:ent_pass2)      { create(:passenger, company: ent_company) }
  let(:ent_pass3)      { create(:passenger, :with_payment_cards, allow_personal_card_usage: true, company: ent_company) }
  let(:ent_booker1)    { create(:booker, passenger_pks: [ent_pass1.id, ent_pass3.id], company: ent_company) }
  let(:ent_booker2)    { create(:booker, passenger_pks: [ent_pass1.id, ent_pass2.id], company: ent_company) }
  let(:aff_booker)     { create(:booker, company: aff_company) }

  scenario 'dashboard' do
    Timecop.freeze(Time.current.prev_month) do
      # ENTERPRISE orders for previous month
      create(:booking, :rejected, :without_passenger, booker: ent_company.admin)
      create(:booking, :completed, :cash, passenger: ent_pass1)
      create(:booking, :cancelled, :ot, passenger: ent_pass3)
      ## AFFILIATE  orders for previous month
      create(:booking, :rejected,  :without_passenger, booker: aff_company.admin)
      create(:booking, :completed, :without_passenger, booker: aff_booker)
      create(:booking, :cancelled, :without_passenger, booker: aff_company.admin)
    end

    # ENTERPRISE Company
    ## non-active users
    create(:passenger, company: ent_company)
    create(:booker, company: ent_company)
    ## asap orders
    create(:booking, :locating, :without_passenger, booker: ent_booker1)
    create(:booking, :arrived, passenger: ent_pass1)
    create(:booking, :on_the_way, passenger: ent_pass1, booker: ent_booker1)
    create(:booking, :in_progress, passenger: ent_pass1, booker: ent_booker2)
    ## future orders
    create(:booking, :locating, :scheduled, passenger: ent_pass2, scheduled_at: 1.day.from_now)
    create(:booking, :arrived, :scheduled, passenger: ent_pass1, booker: ent_booker2, scheduled_at: 1.day.from_now)
    ## completed orders
    create(:booking, :completed, international: true, driver_rating: 5, service_rating: 8, passenger: ent_pass1)
    create(:booking, :completed, :cash, driver_rating: 2, service_rating: 3, passenger: ent_pass2)
    create(:booking, :completed, :ot, :business_card, passenger: ent_pass3, driver_rating: 4, service_rating: 6)
    ## cancelled orders
    create(:booking, :cancelled, :ot, :personal_card, passenger: ent_pass3, booker: ent_booker1)
    create(:booking, :cancelled, international: true, passenger: ent_pass3)
    create(:booking, :cancelled, :cash, passenger: ent_pass3)
    ## rejected orders
    create(:booking, :rejected, :without_passenger, booker: ent_booker1)
    create(:booking, :rejected, :without_passenger, booker: ent_company.admin)

    # AFFILIATE Company
    ## non-active users
    create(:booker, company: aff_company)
    ## asap orders
    create(:booking, :locating, :without_passenger, booker: aff_booker)
    create(:booking, :arrived, :without_passenger, booker: aff_company.admin)
    create(:booking, :on_the_way, :without_passenger, booker: aff_company.admin)
    create(:booking, :in_progress, :without_passenger, booker: aff_booker)
    ## future orders
    create(:booking, :locating, :scheduled, :without_passenger, booker: aff_company.admin, scheduled_at: 1.day.from_now)
    ## completed orders
    create(:booking, :completed, :without_passenger, booker: aff_booker)
    ## cancelled orders
    create(:booking, :cancelled, :without_passenger, booker: aff_company.admin)
    create(:booking, :cancelled, :without_passenger, booker: aff_company.admin)
    ## rejected orders
    create(:booking, :rejected, :without_passenger, booker: aff_booker)

    login_as_super_admin
    statistic_page.load

    expect(statistic_page.enterprise_active_orders).to have_asap(text: 4)
    expect(statistic_page.enterprise_active_orders).to have_future(text: 2)

    expect(statistic_page.affiliate_active_orders).to have_asap(text: 4)
    expect(statistic_page.affiliate_active_orders).to have_future(text: 1)

    expect(statistic_page.enterprise_today).to have_completed(text: 3)
    expect(statistic_page.enterprise_today).to have_cancelled(text: 3)

    expect(statistic_page.affiliate_today).to have_completed(text: 1)
    expect(statistic_page.affiliate_today).to have_cancelled(text: 2)

    expect(statistic_page.ot_vs_gett_completed_today).to have_gett(text: 2)
    expect(statistic_page.ot_vs_gett_completed_today).to have_ot(text: 1)

    expect(statistic_page.international_order_today).to have_completed(text: 1)
    expect(statistic_page.international_order_today).to have_cancelled(text: 1)

    expect(statistic_page.cash_order_today).to have_completed(text: 2)
    expect(statistic_page.cash_order_today).to have_cancelled(text: 3)

    expect(statistic_page.account_order_today).to have_completed(text: 1)
    expect(statistic_page.account_order_today).to have_cancelled(text: 1)

    expect(statistic_page.credit_card_order_today).to have_completed(text: 1)
    expect(statistic_page.credit_card_order_today).to have_cancelled(text: 1)

    expect(statistic_page.active_bookers_today).to have_enterprise(text: 6)
    expect(statistic_page.active_bookers_today).to have_affiliate(text: 2)

    expect(statistic_page.riding_users_today).to have_enterprise(text: 3)
    expect(statistic_page.riding_users_today).to have_affiliate(text: 8)

    expect(statistic_page.riding_companies_today).to have_enterprise(text: 1)
    expect(statistic_page.riding_companies_today).to have_affiliate(text: 1)

    expect(statistic_page.first_time_riders).to have_enterprise(text: 3)
    expect(statistic_page.first_time_riders).to have_affiliate(text: 8)

    expect(statistic_page.avg_rating_today).to have_driver(text: 3.7)
    expect(statistic_page.avg_rating_today).to have_service(text: 5.7)

    statistic_page.enterprise_monthly_orders_chart.first_month.hover
    expect(statistic_page.enterprise_monthly_orders_chart.tooltip.text).to include('Rejected: 1', 'Cancelled: 1', 'Completed: 1')

    statistic_page.enterprise_monthly_orders_chart.last_month.hover
    expect(statistic_page.enterprise_monthly_orders_chart.tooltip.text).to include('Rejected: 2', 'Cancelled: 3', 'Completed: 3')

    statistic_page.affiliate_monthly_orders_chart.first_month.hover
    expect(statistic_page.affiliate_monthly_orders_chart.tooltip.text).to include('Rejected: 1', 'Cancelled: 1', 'Completed: 1')

    statistic_page.affiliate_monthly_orders_chart.last_month.hover
    expect(statistic_page.affiliate_monthly_orders_chart.tooltip.text).to include('Rejected: 1', 'Cancelled: 2', 'Completed: 1')
  end
end
