module Pages
  module Auth
    class SetPassword < Pages::Auth::Base
      set_url('/auth/set?token={token}')

      section :password, Sections::Input, :field, 'password'
      section :password_confirmation, Sections::Input, :field, 'passwordConfirmation'
      element :set_password_button, :button, 'Set your password'
    end
  end
end
