module Pages
  module Admin
    class Base < ::Pages::Base
      section :sidebar, Sections::Admin::LeftSideBar, '#app .sidebar'
      section :pagination, Sections::Pagination, '.ant-table-pagination'

      def logout
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
