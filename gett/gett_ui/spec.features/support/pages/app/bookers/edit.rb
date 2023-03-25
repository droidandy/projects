module Pages
  module App::Bookers
    class Edit < Pages::App::Bookers::Form
      set_url('/bookers/{id}/edit')

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
