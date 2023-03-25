module Pages
  module Admin::GettUsers
    class Form < Pages::Admin::Base
      load_validation do
        [has_role?, 'Page is not fully loaded']
      end

      section :role, Sections::Combobox, :combobox, 'userRoleName'
      section :first_name, Sections::Input, :field, 'firstName'
      section :last_name, Sections::Input, :field, 'lastName'
      section :email, Sections::Input, :field, 'email'
      element :verify_button, :button, 'emailVerify'
      section :password, Sections::Input, :field, 'password'
      section :confirm_password, Sections::Input, :field, 'passwordConfirmation'

      section :create_user_for_front_office, Sections::Switcher, :switcher, 'createUserForFrontOffice'
      section :company, Sections::Combobox, :combobox, 'companyId'
      section :front_role, Sections::Combobox, :combobox, 'memberRoleType'
      section :phone, Sections::Phone, :phone, 'phone'
      element :save_button, :button, 'saveGettUser'
    end
  end
end
