require 'features_helper'

feature 'Invoices' do
  let(:billing_page) { Pages::Admin.billing }

  scenario "Due Date depends on company's payment type" do
    first_company = create(:company, :enterprise, invoicing_schedule: 'weekly', payment_terms: 7)
    second_company = create(:company, :enterprise, :company_payment_card, payment_terms: 90)

    Timecop.freeze(1.week.ago) do
      create(:booking, :completed, :with_charges, :without_passenger, booker: first_company.admin)
    end

    Timecop.freeze(1.month.ago) do
      create(:booking, :completed, :with_charges, :without_passenger, :company_payment_card, booker: second_company.admin)
    end

    UITest.generate_invoice(first_company)
    UITest.generate_invoice(second_company)

    login_as_super_admin
    billing_page.load
    wait_until_true { billing_page.invoices.present? }

    date_today = Time.current.strftime("%d/%m/%Y")
    expect(billing_page.invoices[0]).to have_invoice_date(text: date_today)
    expect(billing_page.invoices[0]).to have_due_date(text: (Time.current + 90.days).strftime("%d/%m/%Y"))

    expect(billing_page.invoices[1]).to have_invoice_date(text: date_today)
    expect(billing_page.invoices[1]).to have_due_date(text: (Time.current + 7.days).strftime("%d/%m/%Y"))
  end

  scenario 'For company with Passenger Payment Card Periodic payment type' do
    company = create(:company, :enterprise, :passenger_payment_card_periodic)
    first_passenger = create(:passenger, :with_business_payment_card, company: company)
    second_passenger = create(:passenger, :with_business_payment_card, company: company)

    Timecop.freeze(1.month.ago) do
      create(:booking, :completed, :with_charges, :business_card, passenger: first_passenger)
      create(:booking, :completed, :with_charges, :business_card, passenger: first_passenger)
      create(:booking, :completed, :with_charges, :business_card, passenger: second_passenger)
    end
    UITest.generate_invoice(company)

    login_as_super_admin
    billing_page.load
    wait_until_true { billing_page.invoices.present? }

    invoice_for_first_passenger = billing_page.invoices.last
    expect(invoice_for_first_passenger).to have_company(text: company.name)
    expect(invoice_for_first_passenger).to have_user(text: first_passenger.full_name)
    expect(invoice_for_first_passenger).to have_invoice_date(text: Time.current.strftime("%d/%m/%Y"))
    expect(invoice_for_first_passenger).to have_amount(text: "£ #{first_passenger.bookings.sum(&:total_cost) / 100}")
    expect(invoice_for_first_passenger).to have_status(text: 'Processing')
    expect(invoice_for_first_passenger).to have_type(text: 'CC Invoice')
    expect(invoice_for_first_passenger).to have_payment_type(text: 'Credit/Debit Card')
    expect(invoice_for_first_passenger).to have_due_date(text: (Time.current + company.payment_terms.days).strftime("%d/%m/%Y"))

    invoice_for_second_passenger = billing_page.invoices.first
    expect(invoice_for_second_passenger).to have_company(text: company.name)
    expect(invoice_for_second_passenger).to have_user(text: second_passenger.full_name)
    expect(invoice_for_second_passenger).to have_invoice_date(text: Time.current.strftime("%d/%m/%Y"))
    expect(invoice_for_second_passenger).to have_amount(text: "£ #{second_passenger.bookings.sum(&:total_cost) / 100}")
    expect(invoice_for_second_passenger).to have_status(text: 'Processing')
    expect(invoice_for_second_passenger).to have_type(text: 'CC Invoice')
    expect(invoice_for_second_passenger).to have_payment_type(text: 'Credit/Debit Card')
    expect(invoice_for_second_passenger).to have_due_date(text: (Time.current + company.payment_terms.days).strftime("%d/%m/%Y"))
  end

  scenario 'Should contains cancelled orders with charges (cancellation fee)' do
    first_company = create(:company, :enterprise)
    second_company = create(:company, :enterprise, :company_payment_card)

    Timecop.freeze(1.month.ago) do
      create(:booking, :cancelled, :with_charges, :without_passenger, fare_quote: 1000, booker: first_company.admin)
      create(:booking, :cancelled, :with_charges, :without_passenger, :company_payment_card, fare_quote: 2000, booker: second_company.admin)
      create(:booking, :cancelled, :without_passenger, :company_payment_card, fare_quote: 3000, booker: second_company.admin)
    end

    UITest.generate_invoice(first_company)
    UITest.generate_invoice(second_company)

    login_as_super_admin
    billing_page.load
    wait_until_true { billing_page.invoices.present? }

    expect(billing_page.invoices[0]).to have_company(text: second_company.name)
    expect(billing_page.invoices[0]).to have_amount(text: "£ 20")

    expect(billing_page.invoices[1]).to have_company(text: first_company.name)
    expect(billing_page.invoices[1]).to have_amount(text: "£ 10")
  end

  scenario 'Should not be generated for orders paid by personal/business cards' do
    company = create(:company, :enterprise, invoicing_schedule: 'weekly', payment_terms: 7)
    first_passenger = create(:passenger, :with_payment_cards, company: company)
    second_passenger = create(:passenger, :with_payment_cards, company: company)

    Timecop.freeze(2.weeks.ago) do
      create(:booking, :completed, :with_charges, passenger: first_passenger)
    end

    Timecop.freeze(1.week.ago) do
      UITest.generate_invoice(company)
      create(:booking, :completed, :with_charges, :personal_card, passenger: first_passenger)
      create(:booking, :completed, :with_charges, :business_card, passenger: second_passenger)
    end
    UITest.generate_invoice(company)

    login_as_super_admin
    billing_page.load
    wait_until_true { billing_page.invoices.present? }

    expect(billing_page).to have_invoices(count: 1)
    expect(billing_page.invoices[0]).to have_invoice_date(text: (Time.current - 1.week).strftime("%d/%m/%Y"))
  end
end
