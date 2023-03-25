module Pages
  module Affiliate
    class ChangePassword < Pages::Affiliate::Base
      set_url('/affiliate/settings/change-password')

      load_validation do
        [email(disabled: true).value.present?, 'still loading']
      end

      section :email, Sections::Input, :fillable_field, 'email'
      section :current_password, Sections::Input, :fillable_field, 'currentPassword'
      section :new_password, Sections::Input, :fillable_field, 'password'
      section :new_password_confirmation, Sections::Input, :fillable_field, 'passwordConfirmation'
      element :change_password_button, :button, 'Apply'
    end
  end
end
