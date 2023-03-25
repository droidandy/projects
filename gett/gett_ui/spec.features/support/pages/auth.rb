module Pages
  module Auth
    def self.login
      Pages::Auth::Login.new
    end

    def self.set_password
      Pages::Auth::SetPassword.new
    end

    def self.reset_password
      Pages::Auth::ResetPassword.new
    end

    def self.privacy_policy
      Pages::Auth::PrivacyPolicy.new
    end

    def self.terms_and_conditions
      Pages::Auth::TermsAndConditions.new
    end

    def self.forgot_password
      Pages::Auth::ForgotPassword.new
    end
  end
end
