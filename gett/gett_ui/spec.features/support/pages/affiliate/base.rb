module Pages
  module Affiliate
    class Base < ::Pages::Base
      section :sidebar, Sections::Affiliate::SideBar, '#app .af-sidebar'
      section :reincarnate, '#app .message' do
        element :company_name, '#app .message > span'
        element :return_to_back_office_button, :button, 'Return to Back Office'
      end
      section :pagination, Sections::Pagination, '.ant-table-pagination'
      sections :notifications, '.ant-notification' do
        element :cross, '[data-icon="close"]'
        def close
          cross.click
        end
      end

      def open_sidebar
        wait_until_true { notifications.empty? || notifications.each(&:close) && BM.sleep(0.01) }
        find('.af-header .menu-icon').click unless sidebar(visible: false).visible?
      end

      def logout
        open_sidebar
        sidebar.logout_button.click
      end

      def attach_image(image = nil)
        path_to_file = Rails.root.join("spec.features/support/fixtures/#{image ? image : 'taxi.jpeg'}")
        find('input[type="file"]', visible: false).set(path_to_file)
        find(:xpath, '//*[@class="ant-modal"]//button[.="Apply"]').click
      end
    end
  end
end
