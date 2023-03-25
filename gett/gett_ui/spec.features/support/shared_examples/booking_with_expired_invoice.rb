RSpec.shared_examples 'can not create booking with existed expired invoice and payment type' do |payment_type|
  it "can not create booking with existed expired invoice and payment type #{payment_type}" do
    company = create(:company, :enterprise, payment_type.to_sym)

    Timecop.freeze(3.months.ago) do
      create(:booking, :completed, :with_charges, :without_passenger, payment_type.to_sym, booker: company.admin)
    end

    Timecop.freeze(2.months.ago) do
      UITest.generate_invoice(company)
    end

    login_to_app_as(company.admin.email)
    expect(new_booking_page).to have_modal
    expect(new_booking_page.modal).to have_body(text: 'Dear Customer, Due to unpaid invoices the service has been suspended. Please contact Gett Business Solutions Billing Department to resolve this issue. Thank you, Gett Business Solutions Team')

    new_booking_page.modal.close_button.click
    new_booking_page.i_am_passenger.click
    new_booking_page.as_directed.click
    new_booking_page.vehicles.wait_until_available
    expect(new_booking_page).to have_save_button(disabled: true, text: 'Order ride')
  end
end
