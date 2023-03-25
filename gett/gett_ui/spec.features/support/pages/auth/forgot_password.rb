module Pages
  module Auth
    class ForgotPassword < Pages::Auth::Base
      set_url('/auth/forgot')

      section :email, Sections::Input, :field, 'email'
      element :reset_now_button, :button, 'Reset now'

      def reset_password_for(email_address)
        email.set(email_address)
        reset_now_button.click
      end
    end
  end
end
