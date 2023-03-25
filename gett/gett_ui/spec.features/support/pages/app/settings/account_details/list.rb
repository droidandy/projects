module Pages
  module App::Settings
    module AccountDetails
      class List < Pages::App::Base
        set_url('/settings/details')

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

        section :sftp_settings, :text_node, 'sftpSettings' do
          element :host, :text_node, 'sftp.host'
          element :port, :text_node, 'sftp.port'
          element :username, :text_node, 'sftp.username'
          element :password, :text_node, 'sftp.password'
        end

        section :hr_feed_paths, :text_node, 'hrFeedPaths' do
          element :users_list, :text_node, 'usersList'
        end

        section :reference_paths, :text_node, 'referencePaths' do
          sections :reference, :text_node, 'reference' do
            element :name, :xpath, './div[1]'
            element :csv_path, :xpath, './div[2]'
          end
        end

        element :logo, :xpath, '//*[@data-name="companyLogo"]/img'
        element :edit_button, :button, 'edit'
        element :edit_logo_button, :button, 'add_edit_logo'
        element :synchronize_button, :button, 'ftp_synchronize'
      end
    end
  end
end
