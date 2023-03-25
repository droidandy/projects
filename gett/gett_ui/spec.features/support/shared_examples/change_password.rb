RSpec.shared_examples "change my password" do
  it 'change password by myself' do
    member_email = company.admin.email
    old_pwd = build(:member).password
    new_pwd = 'P#ssword'

    if company.enterprise?
      login_to_app_as(member_email)
    else
      login_to_affiliate_as(member_email)
    end

    change_password_page.load
    expect(change_password_page.email(disabled: true).value).to eql(member_email)

    # Blank fields validation
    change_password_page.change_password_button.click
    wait_until_true { change_password_page.loaded? }
    expect(change_password_page.current_password.error_message).to eql('Please enter your password')
    expect(change_password_page.new_password.error_message).to eql('Please enter your password')
    expect(change_password_page.new_password_confirmation.error_message).to eql('Please enter your password')

    # Wrong Current Password The password you entered is incorrect
    change_password_page.current_password.set('incorrect_password')
    change_password_page.new_password.set(new_pwd)
    change_password_page.new_password_confirmation.set(new_pwd)
    change_password_page.change_password_button.click
    wait_until_true { change_password_page.loaded? }
    expect(change_password_page.current_password.error_message).to eql('The password you entered is incorrect')

    # new Password does not meet requirements
    change_password_page.current_password.set(old_pwd)
    change_password_page.new_password.set('new_password')
    change_password_page.new_password_confirmation.set('new_password')
    change_password_page.change_password_button.click
    wait_until_true { change_password_page.loaded? }
    expect(change_password_page.new_password.error_message).to eql('Password does not meet requirements')

    # confirm These passwords do not match
    change_password_page.current_password.set(old_pwd)
    change_password_page.new_password.set(new_pwd)
    change_password_page.new_password_confirmation.set(new_pwd.upcase)
    change_password_page.change_password_button.click
    wait_until_true { change_password_page.loaded? }
    expect(change_password_page.new_password_confirmation.error_message).to eql('These passwords do not match')

    change_password_page.current_password.set(old_pwd)
    change_password_page.new_password.set(new_pwd)
    change_password_page.new_password_confirmation.set(new_pwd)
    change_password_page.change_password_button.click

    change_password_page.logout
    if app?
      auth_page.attempt_to_login_to_app_as(member_email, old_pwd)
    else
      auth_page.attempt_to_login_to_affiliate_as(member_email, old_pwd)
    end

    expect(auth_page).to have_error_message(text: 'The email or password you entered is incorrect.')
    if app?
      auth_page.login_to_app_as(member_email, new_pwd)
    else
      auth_page.login_to_affiliate_as(member_email, new_pwd)
    end
    expect(new_booking_page).to be_loaded
  end
end
