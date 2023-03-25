module Pages
  module App::Settings
    module ReportSettings
      class List < Pages::App::Base
        set_url('/settings/csv-reports')

        element :add_new_csv_report_button, :button, 'Add New CSV Report'
        section :delete_modal, Sections::DeleteModal, '.ant-modal-content'

        sections :reports, '.ant-table-row' do
          element :name,          :xpath,  './td[1]'
          element :recurrence,    :xpath,  './td[2]'
          element :edit_button,   :button, 'Edit'
          element :delete_button, :button, 'Delete'
        end

        section :add_new_report_modal, Sections::Modal, '.ant-modal-content' do
          section :name,       Sections::Input,      :fillable_field, 'name'
          section :repeat,     Sections::Combobox,   :combobox,       'recurrence'
          section :date,       Sections::Calendar,   '[data-name="datePicker"]'
          section :time,       Sections::TimePicker, '[data-name="recurrenceStartsAt"]'
          section :delimiter,  Sections::Input,      :fillable_field, 'delimiter'
          section :recipients, Sections::Input,      :fillable_field, 'recipients'

          element :show_columns, 'div.blue-text', text: 'Show Columns'
          element :hide_columns, 'div.blue-text', text: 'Hide Columns'

          section :columns, '.ant-collapse' do
            [
              'Order ID', 'Company ID', 'Company Name', 'Company Address', 'Company Email', 'Company Contact',
              'Account Manager', 'Billing Terms', 'Scheduled Order Date/Time', 'Order Creation Date/Time',
              'Arrived At', 'Started At', 'Ended At', 'Cancelled At', 'Car Type', 'Pickup Address', 'Destination Address',
              'Stop Point 1', 'Stop Point 2', 'Stop Point 3', 'Stop Point 4', 'Payment Type', 'References', 'Booker Name',
              'Riding User ID', 'Riding User Name', 'Riding User Department', 'Riding User Work Role',
              'Riding User Cost Centre', 'Riding User Division', 'Riding User Payroll ID', 'Riding User Email',
              'Base Fare', 'Run-In Fee', 'Booking Fee', 'Phone Booking Fee', 'Handling Fee', 'International Fee',
              'Total Fees', 'Extra Fee 1', 'Extra Fee 2', 'Extra Fee 3', 'Waiting Time Minutes', 'Waiting Time Cost',
              'Cancellation Cost', 'VAT', 'Final Cost Excl VAT', 'Final Cost Incl VAT', 'Status', 'Reason For Travel'
            ].each do |checkbox_text|
              name = checkbox_text.downcase.gsub(/\W/, '_')
              section name, Sections::Checkbox, '.ant-checkbox-wrapper', text: /^#{checkbox_text}$/
            end
          end
        end
      end
    end
  end
end
