module Sections
  module Admin::Companies
    class Company < SitePrism::Section
      element :expand_icon, :xpath, './td[1]/span', visible: false
      element :company_id, :xpath, './td[2]'
      element :company_type, :xpath, './td[3]'
      element :company_name, :xpath, './td[6]'
      element :company_status, :xpath, './td[8]'
      section :details, Sections::Admin::Companies::Details, :xpath, './following-sibling::tr[1]//div[@data-name="companyDetails"]'

      def id
        company_id.text
      end

      def type
        company_type.text
      end

      def name
        company_name.text
      end

      def status
        company_status.text
      end

      def open_details
        company_id.click unless expanded?
        wait_until_details_visible
      end

      def close_details
        company_id.click if expanded?
        wait_until_details_invisible
      end

      def expanded?
        next_row = root_element.first(:xpath, './following-sibling::tr[1]')
        next_row.present? && next_row[:class].include?('ant-table-expanded-row')
      end
    end
  end
end
