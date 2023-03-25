module Sections
  module App::Settings
    class Invoice < SitePrism::Section
      element :invoice_date, :xpath, './td[2]'
      element :invoice_id, :xpath, './td[3]'
      element :amount, :xpath, './td[4]'
      element :description, :xpath, './td[5]'
      element :status, :xpath, './td[6]'
      element :type, :xpath, './td[7]'
      element :payment_type, :xpath, './td[8]'
      element :actions, :xpath, './td[9]/div'

      section :actions_menu, :xpath, '//*[@role="menu"]' do
        element :export_pdf, :menu_item, 'Export PDF'
        element :export_csv, :menu_item, 'Export CSV'
        element :pay, :menu_item, 'Pay'
      end

      def selected?
        root_element.find(:xpath, './td[1]//input', visible: false).checked?
      end

      def toggle_actions_menu
        actions.click
      end
    end
  end
end
