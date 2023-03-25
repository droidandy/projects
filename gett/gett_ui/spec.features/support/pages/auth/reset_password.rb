module Pages
  module Auth
    class ResetPassword < Pages::Auth::Base
      set_url('/auth/reset?token={token}')

      section :password, Sections::Input, :field, 'password'
      section :password_confirmation, Sections::Input, :field, 'passwordConfirmation'
      element :set_password_button, :button, 'Change your password'
    end
  end
end
