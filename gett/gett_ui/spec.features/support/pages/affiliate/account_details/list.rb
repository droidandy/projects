module Pages
  module Affiliate
    module AccountDetails
      class List < Pages::Affiliate::Base
        set_url('/affiliate/settings/details')

        section :primary_contact, :text_node, 'primaryContact' do
          element :first_name, :text_node, 'primaryContact.firstName'
          element :last_name, :text_node, 'primaryContact.lastName'
          element :phone, :text_node, 'primaryContact.phone'
          element :company_mobile, :text_node, 'primaryContact.mobile'
          element :fax, :text_node, 'primaryContact.fax'
          element :email, :text_node, 'primaryContact.email'
          element :address, :text_node, 'primaryContact.address'
          element :customer_service_phone, :text_node, 'customerServicePhone'
        end

        section :billing_contact, :text_node, 'billingContact' do
          element :first_name, :text_node, 'billingContact.firstName'
          element :last_name, :text_node, 'billingContact.lastName'
          element :billing_phone, :text_node, 'billingContact.phone'
          element :company_mobile, :text_node, 'billingContact.mobile'
          element :billing_fax, :text_node, 'billingContact.fax'
          element :billing_email, :text_node, 'billingContact.email'
          element :billing_address, :text_node, 'billingContact.address'
        end

        element :logo, :xpath, '//*[@data-name="companyLogo"]/img'
        element :edit_button, :button, 'edit'
        element :edit_logo_button, :button, 'add_edit_logo'
      end
    end
  end
end
