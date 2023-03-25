require 'features_helper'

feature 'User Roles' do
  let(:user_roles_page)     { Pages::App.user_roles }
  let(:new_booking_page)    { Pages::App.new_booking }
  let(:edit_passenger_page) { Pages::App.edit_passenger }
  let(:company)             { create(:company, :enterprise) }
  let(:existed_role)        { create(:work_role, company: company) }
  let!(:first_passenger)    { create(:passenger, company: company) }
  let!(:second_passenger)   { create(:passenger, company: company, work_role: existed_role) }
  let(:new_name)            { 'Avenger' }

  before do
    login_to_app_as(company.admin.email)
    user_roles_page.load
    expect(user_roles_page).to be_loaded
    wait_until_true { user_roles_page.user_roles.present? }
  end

  scenario 'Create' do
    user_roles_page.add_new_user_role_button.click
    user_roles_page.wait_until_user_role_form_visible

    form = user_roles_page.user_role_form
    expect(form).to have_name(text: "")
    form.save_button.click
    expect(form.name.error_message).to eql("can't be blank")

    form.name.set(existed_role.name)
    form.save_button.click
    expect(form.name.error_message).to eql("is already taken")

    form.name.set(new_name)
    form.employees.select(first_passenger.full_name)
    form.save_button.click
    user_roles_page.wait_until_user_role_form_invisible
    expect(user_roles_page).to have_user_roles(count: 2)

    edit_passenger_page.load(id: first_passenger.id)
    expect(edit_passenger_page.work_role.selected_options).to eql(new_name)
  end

  scenario 'Edit' do
    record = user_roles_page.get_user_role_by_name(existed_role.name)
    record.edit_button.click

    user_roles_page.wait_until_user_role_form_visible
    form = user_roles_page.user_role_form
    form.name.set(new_name)
    form.save_button.click
    user_roles_page.wait_until_user_role_form_invisible
    expect(user_roles_page).to have_user_roles(count: 1)

    edit_passenger_page.load(id: second_passenger.id)
    expect(edit_passenger_page.work_role.selected_options).to eql(new_name)
  end

  scenario 'Delete' do
    record = user_roles_page.get_user_role_by_name(existed_role.name)
    record.delete_button.click
    user_roles_page.delete_modal.ok_button.click
    expect(user_roles_page).to have_text("You don't have any user roles set.")

    edit_passenger_page.load(id: second_passenger.id)
    expect(edit_passenger_page.work_role.selected_options).to be_blank
  end
end
