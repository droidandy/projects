require 'features_helper'

feature 'Affiliate Account Details Page' do
  let(:new_booking_page)          { Pages::Affiliate.bookings }
  let(:account_details_page)      { Pages::Affiliate.account_details }
  let(:edit_account_details_page) { Pages::Affiliate.edit_account_details }
  let(:companies_page)            { Pages::Admin.companies }
  let(:edit_company_page)         { Pages::Admin.edit_company }
  let(:company)                   { create(:company, :affiliate, admin_phone: '+44725807399') }

  feature 'Permissions' do
    include_examples 'Account Details Page permission for', :booker
    include_examples 'Account Details Page permission for', :admin
  end

  scenario 'Add Logo' do
    login_to_affiliate_as(company.admin.email) do
      account_details_page.load
    end

    account_details_page.attach_image
    expect(account_details_page).to have_logo
  end

  scenario 'Edit' do
    login_to_affiliate_as(company.admin.email)
    account_details_page.load
    expect(account_details_page.primary_contact).to have_first_name(text: company.admin.first_name)
    expect(account_details_page.primary_contact).to have_last_name(text: company.admin.last_name)
    expect(account_details_page.primary_contact).to have_phone(text: '+44 7258 07399')
    expect(account_details_page.primary_contact).to have_company_mobile(text: '-')
    expect(account_details_page.primary_contact).to have_fax(text: '-')
    expect(account_details_page.primary_contact).to have_email(text: company.admin.email)
    expect(account_details_page.primary_contact).to have_address(text: company.address.line)
    expect(account_details_page.primary_contact).to have_customer_service_phone(text: company.ddi.phone)

    expect(account_details_page.billing_contact).to have_first_name(text: '-')
    expect(account_details_page.billing_contact).to have_last_name(text: '-')
    expect(account_details_page.billing_contact).to have_billing_phone(text: '-')
    expect(account_details_page.billing_contact).to have_company_mobile(text: '-')
    expect(account_details_page.billing_contact).to have_billing_fax(text: '-')
    expect(account_details_page.billing_contact).to have_billing_email(text: '-')
    expect(account_details_page.billing_contact).to have_billing_address(text: '-')

    account_details_page.edit_button.click
    expect(edit_account_details_page).to be_loaded

    edit_account_details_page.primary_contact.first_name.clear
    edit_account_details_page.primary_contact.second_name.clear
    edit_account_details_page.primary_contact.phone.clear
    edit_account_details_page.primary_contact.company_mobile.clear
    edit_account_details_page.primary_contact.fax.clear
    edit_account_details_page.primary_contact.email.clear
    edit_account_details_page.primary_contact.address.select(' ', autocomplete: false)

    edit_account_details_page.save_button.click
    expect(edit_account_details_page.primary_contact.phone.error_message).to eql("can't be blank")
    expect(edit_account_details_page.primary_contact.address.error_message).to eql("Address not found. Please check the address entered.")

    edit_account_details_page.primary_contact.phone.set('a1b2c3d4e')
    edit_account_details_page.primary_contact.email.set('fakemail.com@a')
    edit_account_details_page.billing_contact.billing_email.set('@fakemail.com')

    edit_account_details_page.save_button.click
    expect(edit_account_details_page.primary_contact.phone.error_message).to eql('Invalid phone format')
    expect(edit_account_details_page.primary_contact.email.error_message).to eql('Email is not valid')
    expect(edit_account_details_page.billing_contact.billing_email.error_message).to eql('Email is not valid')

    edit_account_details_page.primary_contact.first_name.set('New First P Name')
    edit_account_details_page.primary_contact.second_name.set('New Last P Name')
    edit_account_details_page.primary_contact.phone.set('+1 (111) 465-0938')
    edit_account_details_page.primary_contact.company_mobile.set('+07 9753 22023')
    edit_account_details_page.primary_contact.fax.set('1234567890')
    edit_account_details_page.primary_contact.email.set('new_p_email@fakemail.com')
    with_headers do
      set_address_headers 'The O2, Peninsula Square'
      edit_account_details_page.primary_contact.address.select('The O2, Peninsula Square')
    end

    edit_account_details_page.billing_contact.first_name.set('New First B Name')
    edit_account_details_page.billing_contact.second_name.set('New Last P Name')
    edit_account_details_page.billing_contact.billing_phone.set('+40-18-108-3938')
    edit_account_details_page.billing_contact.company_mobile.set('+01 6151 81571')
    edit_account_details_page.billing_contact.billing_fax.set('0123456789')
    edit_account_details_page.billing_contact.billing_email.set('new_b_email@fakemail.com')
    with_headers do
      set_address_headers '312 Vauxhall Bridge Rd'
      edit_account_details_page.billing_contact.address_finder.select('312 Vauxhall Bridge Rd')
    end

    edit_account_details_page.save_button.click
    expect(account_details_page).to be_loaded

    expect(account_details_page.primary_contact).to have_first_name(text: 'New First P Name')
    expect(account_details_page.primary_contact).to have_last_name(text: 'New Last P Name')
    expect(account_details_page.primary_contact).to have_phone(text: '1 (111) 465-0938')
    expect(account_details_page.primary_contact).to have_company_mobile(text: '+07 9753 22023')
    expect(account_details_page.primary_contact).to have_fax(text: '1234567890')
    expect(account_details_page.primary_contact).to have_email(text: 'new_p_email@fakemail.com')
    expect(account_details_page.primary_contact).to have_address(text: 'The O2, Peninsula Square')
    expect(account_details_page.primary_contact).to have_customer_service_phone(text: company.ddi.phone)

    expect(account_details_page.billing_contact).to have_first_name(text: 'New First B Name')
    expect(account_details_page.billing_contact).to have_last_name(text: 'New Last P Name')
    expect(account_details_page.billing_contact).to have_billing_phone(text: '+40-18-108-3938')
    expect(account_details_page.billing_contact).to have_company_mobile(text: '+01 6151 81571')
    expect(account_details_page.billing_contact).to have_billing_fax(text: '0123456789')
    expect(account_details_page.billing_contact).to have_billing_email(text: 'new_b_email@fakemail.com')
    expect(account_details_page.billing_contact).to have_billing_address(text: '312 Vauxhall Bridge Rd')
  end
end
