module Pages
  module Affiliate::Bookers
    class Edit < Pages::Affiliate::Bookers::Form
      set_url('/affiliate/bookers/{id}/edit')

      element :reinvite_button, :button, 'Reinvite'
      element :change_log_tab, :xpath, '//div[@role="tab" and .="Change Log"]'
      sections :change_logs, 'div.ant-tabs-tabpane-active .ant-table-row-level-0' do
        element :field_name, :xpath, './/td[1]'
        element :author, :xpath, './/td[2]'
        element :from, :xpath, './/td[3]'
        element :to, :xpath, './/td[4]'
      end

      def change_log_by_field_name(text)
        change_logs.find { |cl| cl.field_name.text == text }
      end
    end
  end
end
