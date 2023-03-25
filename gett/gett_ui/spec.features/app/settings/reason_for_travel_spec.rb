require 'features_helper'

feature 'Reason For Travel' do
  let(:reason_for_travel_page) { Pages::App.reason_for_travel }
  let(:new_booking_page)       { Pages::App.new_booking }
  let(:company)                { create(:company, :enterprise) }
  let!(:existed_reason)        { create(:travel_reason, company: company) }
  let(:new_name)               { 'Wanna Home!' }

  before do
    login_to_app_as(company.admin.email)
    reason_for_travel_page.load
    expect(reason_for_travel_page).to be_loaded
    wait_until_true { reason_for_travel_page.reasons.present? }
  end

  scenario 'Create' do
    reason_for_travel_page.add_new_reason_for_travel_button.click
    reason_for_travel_page.wait_until_reason_form_visible

    form = reason_for_travel_page.reason_form
    expect(form).to have_name(text: "")
    form.save_button.click
    expect(form.name.error_message).to eql("can't be blank")

    form.name.set(existed_reason.name)
    form.save_button.click
    expect(form.name.error_message).to eql("is already taken")

    form.name.set(new_name)
    form.save_button.click
    reason_for_travel_page.wait_until_reason_form_invisible
    expect(reason_for_travel_page).to have_reasons(count: 2)

    created_reason = reason_for_travel_page.get_reason_by_name(new_name)
    expect(created_reason.active).to be_checked

    created_reason.active.click
    expect(created_reason.active).not_to be_checked

    new_booking_page.load
    expect(new_booking_page).to be_loaded
    expect(new_booking_page.reason_for_travel.available_options).to eql(['Other', existed_reason.name])
  end

  scenario 'Edit' do
    record = reason_for_travel_page.get_reason_by_name(existed_reason.name)
    record.edit_button.click

    reason_for_travel_page.wait_until_reason_form_visible
    form = reason_for_travel_page.reason_form
    form.name.set(new_name)
    form.save_button.click
    reason_for_travel_page.wait_until_reason_form_invisible
    expect(reason_for_travel_page).to have_reasons(count: 1)

    created_reason = reason_for_travel_page.get_reason_by_name(new_name)
    expect(created_reason.active).to be_checked
  end

  scenario 'Delete' do
    record = reason_for_travel_page.get_reason_by_name(existed_reason.name)
    record.delete_button.click
    reason_for_travel_page.delete_modal.ok_button.click
    expect(reason_for_travel_page).to have_text("You don't have any reasons for travel set")
  end
end
