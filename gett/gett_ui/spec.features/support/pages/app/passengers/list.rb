module Pages
  module App::Passengers
    class List < Pages::App::Base
      set_url('/passengers')
      load_validation do
        [total.text.present?, 'Total count is not loaded']
      end

      element :total, 'div.mr-40', match: :first, visible: false
      sections :passengers, Sections::App::Passengers::Passenger, '.ant-table-row-level-0'

      section :search_field, Sections::Input, :field, 'searchPassenger'
      element :new_passenger_button, :button, 'New Passenger'
      element :export_button, :button, 'Export'
      element :import_button, :button, 'Import'
      element :total_passengers, :xpath, '//div[./div[.="Total passengers"]]/div[1]'
      element :active_passengers, :xpath, '//div[./div[.="Active passengers"]]/div[1]'

      def all_names
        passengers.map(&:name)
      end

      def get_passenger_by_name(name)
        wait_until_true { passengers.present? }
        passengers.find{ |p| p.name == name }
      end

      def get_passenger_by_email(email)
        wait_until_true { passengers.present? }
        passengers.find{ |p| p.email == email }
      end

      section :import_modal, '.ant-modal-content' do
        element :browse_button, :button, 'Browse'
        element :import_button, :button, 'Import'
        section :start_employee_on_boarding, Sections::Checkbox, :checkbox, 'onboarding'
        element :show_errors_list, :xpath, './/span[.="show error list"]'
        element :created_count, :text_node, 'createdCount'
        element :updated_count, :text_node, 'updatedCount'
        element :rejected_count, :text_node, 'rejectedCount'
        element :errors_list, :text_node, 'errorsList'
        element :close_button, '.ant-modal-close-x'

        def set_file_for_import
          path_to_file = Rails.root.join('spec.features/support/fixtures/passenger_import.csv')
          find('input[type="file"]', visible: false).set(path_to_file)
        end

        def open_errors_list
          show_errors_list.click
          wait_until_errors_list_visible
        end

        def all_errors_list
          errors_list.all(:xpath, './div').map(&:text)
        end
      end
    end
  end
end
