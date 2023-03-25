module Pages
  module App
    class Base < ::Pages::Base
      section :sidebar, Sections::App::LeftSideBar, '#app .sidebar'
      section :reincarnate, '#app .message' do
        element :company_name, '#app .message > span'
        element :return_to_back_office_button, :button, 'Return to Back Office'
      end
      section :welcome_modal, Sections::App::WelcomeModal, :xpath, '//div[@class="ant-modal-content"][.//div[.="Welcome to Gett Enterprise,"]]'
      section :notification, Sections::NotificationPopup, :xpath, "//*[contains(concat(' ', normalize-space(@class), ' '), ' ant-notification ')]"
      element :page_content, '#scrollContainer > div'
      section :modal, Sections::Modal, '.ant-modal'
      section :pagination, Sections::Pagination, '.ant-table-pagination'

      element :table_placeholder, '.ant-table-placeholder'

      def table_loaded?
        has_no_table_placeholder?
      end

      def attach_image(image = nil)
        path_to_file = Rails.root.join("spec.features/support/fixtures/#{image ? image : 'taxi.jpeg'}")
        find('input[type="file"]', visible: false).set(path_to_file)
        find(:xpath, '//*[@class="ant-modal"]//button[.="Apply"]').click
      end

      def logout
        sidebar.logout_button.click
      end
    end
  end
end
