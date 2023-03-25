require 'features_helper'

feature 'Departments' do
  let(:departments_page)    { Pages::App.departments }
  let(:new_booking_page)    { Pages::App.new_booking }
  let(:edit_passenger_page) { Pages::App.edit_passenger }
  let(:company)             { create(:company, :enterprise) }
  let(:existed_department)  { create(:department, company: company) }
  let!(:first_passenger)    { create(:passenger, company: company) }
  let!(:second_passenger)   { create(:passenger, company: company, department: existed_department) }
  let(:new_name)            { 'Space Invaders' }

  before do
    login_to_app_as(company.admin.email)
    departments_page.load
    wait_until_true { departments_page.departments.present? }
  end

  scenario 'Create' do
    departments_page.add_new_department_button.click
    departments_page.wait_until_department_form_visible

    form = departments_page.department_form
    expect(form).to have_name(text: "")
    form.save_button.click
    expect(form.name.error_message).to eql("can't be blank")

    form.name.set(existed_department.name)
    form.save_button.click
    expect(form.name.error_message).to eql("is already taken")

    form.name.set(new_name)
    form.employees.select(first_passenger.full_name)
    form.save_button.click
    departments_page.wait_until_department_form_invisible
    expect(departments_page).to have_departments(count: 2)

    edit_passenger_page.load(id: first_passenger.id)
    expect(edit_passenger_page.department.selected_options).to eql(new_name)
  end

  scenario 'Edit' do
    record = departments_page.get_department_by_name(existed_department.name)
    record.edit_button.click

    departments_page.wait_until_department_form_visible
    form = departments_page.department_form
    form.name.set(new_name)
    form.save_button.click
    departments_page.wait_until_department_form_invisible
    expect(departments_page).to have_departments(count: 1)

    edit_passenger_page.load(id: second_passenger.id)
    expect(edit_passenger_page.department.selected_options).to eql(new_name)
  end

  scenario 'Delete' do
    record = departments_page.get_department_by_name(existed_department.name)
    record.delete_button.click
    departments_page.delete_modal.ok_button.click
    expect(departments_page).to have_text("You don't have any departments set")

    edit_passenger_page.load(id: second_passenger.id)
    expect(edit_passenger_page.department.selected_options).to be_blank
  end
end
