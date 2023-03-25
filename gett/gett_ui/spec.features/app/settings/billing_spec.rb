require 'features_helper'

feature 'Invoices' do
  let(:billing_page) { Pages::App.billing }

  scenario 'Actions, Outstanding Balance and Payment Amount' do
    company = create(:company, :enterprise)
    create(:invoice, :paid, company: company)
    create(:invoice, :partially_paid, company: company)
    create(:invoice, :overdue, amount_cents: 20000, company: company)
    create(:invoice, amount_cents: 5600, company: company)

    login_to_app_as(company.admin.email)
    billing_page.load

    expect(billing_page).to have_outstanding_balance(text: "261")
    billing_page.select_all_invoices
    expect(billing_page.invoices[0]).to have_status(text: 'Outstanding')
    expect(billing_page.invoices[0]).to be_selected
    billing_page.invoices[0].toggle_actions_menu
    expect(billing_page.invoices[0]).to have_actions_menu
    expect(billing_page.invoices[0].actions_menu).to have_export_pdf
    expect(billing_page.invoices[0].actions_menu).to have_export_csv
    expect(billing_page.invoices[0].actions_menu).to have_pay
    billing_page.invoices[0].toggle_actions_menu
    billing_page.invoices[0].wait_until_actions_menu_invisible

    expect(billing_page.invoices[1]).to have_status(text: 'Overdue')
    expect(billing_page.invoices[1]).to be_selected
    billing_page.invoices[1].toggle_actions_menu
    expect(billing_page.invoices[1]).to have_actions_menu
    expect(billing_page.invoices[1].actions_menu).to have_export_pdf
    expect(billing_page.invoices[1].actions_menu).to have_export_csv
    expect(billing_page.invoices[1].actions_menu).to have_pay
    billing_page.invoices[1].toggle_actions_menu
    billing_page.invoices[1].wait_until_actions_menu_invisible

    expect(billing_page.invoices[2]).to have_status(text: 'Partial Paid')
    expect(billing_page.invoices[2]).to be_selected
    billing_page.invoices[2].toggle_actions_menu
    expect(billing_page.invoices[2]).to have_actions_menu
    expect(billing_page.invoices[2].actions_menu).to have_export_pdf
    expect(billing_page.invoices[2].actions_menu).to have_export_csv
    expect(billing_page.invoices[2].actions_menu).to have_pay
    billing_page.invoices[2].toggle_actions_menu
    billing_page.invoices[2].wait_until_actions_menu_invisible

    expect(billing_page.invoices[3]).to have_status(text: 'Paid')
    expect(billing_page.invoices[3]).not_to be_selected
    billing_page.invoices[3].toggle_actions_menu
    expect(billing_page.invoices[3]).to have_actions_menu
    expect(billing_page.invoices[3].actions_menu).to have_export_pdf
    expect(billing_page.invoices[3].actions_menu).to have_export_csv
    expect(billing_page.invoices[3].actions_menu).to have_pay
    expect(billing_page.invoices[3].actions_menu.pay).to be_disabled
    billing_page.invoices[3].toggle_actions_menu
    billing_page.invoices[3].wait_until_actions_menu_invisible

    billing_page.pay_with_card_button.click
    expect(billing_page).to have_new_payment
    expect(billing_page.new_payment).to have_total_due(text: "261")
  end
end
