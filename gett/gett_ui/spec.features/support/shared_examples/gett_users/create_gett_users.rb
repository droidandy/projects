RSpec.shared_examples 'create Gett User' do |role, fo_role, real_login = true|
  it "with role #{role} and FrontOffice's role #{fo_role}" do
    password = 'p!ssWord'
    existed_user = create(:user)

    if real_login
      auth_page.login_as_super_admin
    else
      login_as_super_admin
    end
    page = new_gett_user_page
    page.load
    page.submit

    page.role.select role
    expect(page.first_name.error_message).to eql("can't be blank")
    expect(page.last_name.error_message).to eql("can't be blank")
    expect(page.email.error_message).to eql('Please click on Verify button to check email')
    expect(page.password.error_message).to eql("can't be blank")
    expect(page.confirm_password.error_message).to eql("can't be blank")

    page.first_name.set(fake_user.first_name)
    page.last_name.set(fake_user.last_name)
    page.email.set(existed_user.email)
    page.verify_button.click
    expect(page.email.error_message).to eql('Back office user with such email already exists')
    page.email.set(fake_user.email)
    page.verify_button.click
    expect(page).to have_verify_button(text: 'Verified')
    expect(page).to have_text('There is no user with such email in Back or Front offices')

    page.password.set('password')
    page.confirm_password.set('paSsword')
    expect(page.password.error_message).to eql('Password does not meet requirements')
    expect(page.confirm_password.error_message).to eql('is not equal to password')

    page.password.set(password)
    page.confirm_password.set(password)

    page.create_user_for_front_office.click
    expect(page).to have_company
    page.phone.clear
    page.submit

    expect(page.company.error_message).to eql("can't be blank")
    expect(page.front_role.error_message).to eql("can't be blank")
    expect(page.phone.error_message).to eql("can't be blank")

    page.company.select company.name
    page.front_role.select(fo_role.downcase.delete(' ').capitalize)
    page.phone.set(fake_user.phone)

    page.submit
    wait_until_true { gett_users_page.loaded? }
    wait_until_true { gett_users_page.users.present? }
    created_user = gett_users_page.get_user_by_email(fake_user.email)
    expect(created_user).to have_user_role(text: role)
    gett_users_page.logout

    if real_login
      auth_page.login_to_admin_as(fake_user.email, password, true)
    else
      login_to_admin_as(fake_user.email, password)
    end
    landing_page = (role == 'Outsourced Customer Care') ? ote_new_booking_page : companies_page
    wait_until_true { landing_page.loaded? }
    landing_page.logout

    if real_login
      auth_page.login_to_app_as(fake_user.email, password, true)
    else
      login_to_app_as(fake_user.email, password)
    end
    wait_until_true { new_booking_page.loaded? }
    if fo_role == 'Passenger'
      expect(new_booking_page.sidebar).to have_no_bookers
    else
      bookers_page.load
      member = bookers_page.get_booker_by_email(fake_user.email)
      expect(member.role).to eql(fo_role)
    end
  end
end
