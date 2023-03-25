module Pages
  module Affiliate
    module AccountDetails
      class Edit < Pages::Affiliate::Base
        set_url('/affiliate/settings/details/edit')

        section :primary_contact, :text_node, 'primaryContact' do
          section :first_name, Sections::Input, :field, 'primaryContact.firstName'
          section :second_name, Sections::Input, :field, 'primaryContact.lastName'
          section :phone, Sections::Phone, :phone, 'primaryContact.phone'
          section :company_mobile, Sections::Phone, :phone, 'primaryContact.mobile'
          section :fax, Sections::Input, :field, 'primaryContact.fax'
          section :email, Sections::Input, :field, 'primaryContact.email'
          section :address, Sections::Autocomplete, :combobox, 'address'
        end

        section :billing_contact, :text_node, 'billingContact' do
          section :first_name, Sections::Input, :field, 'billingContact.firstName'
          section :second_name, Sections::Input, :field, 'billingContact.lastName'
          section :billing_phone, Sections::Phone, :phone, 'billingContact.phone'
          section :company_mobile, Sections::Phone, :phone, 'billingContact.mobile'
          section :billing_fax, Sections::Input, :field, 'billingContact.fax'
          section :billing_email, Sections::Input, :field, 'billingContact.email'
          section :address_finder, Sections::Autocomplete, :combobox, 'billingContact.address'
        end

        element :cancel_button, :button, 'Cancel'
        element :save_button, :button, 'Save'
      end
    end
  end
end
