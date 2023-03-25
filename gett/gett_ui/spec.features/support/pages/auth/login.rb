module Pages
  module Auth
    class Login < Pages::Auth::Base
      set_url('/auth')
      set_url_matcher %r{auth\/?}

      section :email, Sections::Input, :field, 'Email'
      section :password, Sections::Input, :field, 'Password'
      element :login_button, :button, 'Log In'
      element :error_message, :text_node, 'errorMessage'
      section :notification, Sections::NotificationPopup, :xpath, "//*[contains(concat(' ', normalize-space(@class), ' '), ' ant-notification ')]"
      section :office_selector, '.ant-modal-content' do
        element :back_office_button, :button, 'Back Office'
        element :front_office_button, :button, 'Front Office'
      end

      def login_as(user_email, user_password = 'P@ssword')
        email.set user_email
        password.set user_password
        login_button.click
      end

      def login_as_super_admin
        load
        login_as(UITest.config[:super_admin][:email], UITest.config[:super_admin][:password])
        Pages::Admin::Base.new.wait_until_sidebar_visible(wait: 5)
      end

      def attempt_to_login_to_app_as(user_email, user_password = 'P@ssword', select_office = false)
        load
        login_as(user_email, user_password)
        if select_office
          wait_until_office_selector_visible
          BM.sleep 1 # wait for animation
          office_selector.front_office_button.click
        end
      end

      def app_logged_in?
        Pages::App::Base.new.wait_until_sidebar_visible(wait: 5)
      end

      def login_to_app_as(user_email, user_password = 'P@ssword', select_office = false)
        attempt_to_login_to_app_as(user_email, user_password, select_office)
        app_logged_in?
      end

      def login_to_admin_as(user_email, user_password = 'P@ssword', select_office = false)
        load
        login_as(user_email, user_password)
        if select_office
          wait_until_office_selector_visible
          BM.sleep 1 # wait for animation
          office_selector.back_office_button.click
        end
        Pages::Admin::Base.new.wait_until_sidebar_visible(wait: 5)
      end

      def attempt_to_login_to_affiliate_as(user_email, user_password = 'P@ssword')
        load
        login_as(user_email, user_password)
      end

      def affiliate_logged_in?
        Pages::Affiliate::Bookings.new.wait_until_company_name_visible(wait: 5)
      end

      def login_to_affiliate_as(user_email, user_password = 'P@ssword')
        attempt_to_login_to_affiliate_as(user_email, user_password)
        affiliate_logged_in?
      end
    end
  end
end
