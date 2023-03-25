require 'features_helper'

feature 'User Password' do
  let(:auth_page)  { Pages::Auth.login }
  let(:users_page) { Pages::Admin.all_users }
  let!(:company)   { create(:company, :enterprise) }
  let(:new_booking_page) { Pages::App.new_booking }

  scenario 'Set new', priority: :low do
    login_as_super_admin
    users_page.load

    users_record = users_page.get_user_by_email(company.admin.email)
    users_record.actions.click
    users_record.wait_until_actions_menu_visible
    users_record.actions_menu.set_password.click
    users_page.wait_until_set_password_modal_visible
    users_page.set_password_modal.new_password('newPassword')
    users_page.wait_until_set_password_modal_invisible
    users_page.logout

    auth_page.login_as(company.admin.email, 'P@ssword')
    expect(auth_page).to have_error_message(text: 'The email or password you entered is incorrect.')

    auth_page.login_as(company.admin.email, 'newPassword')
    wait_until_true { new_booking_page.loaded? }
  end
end
