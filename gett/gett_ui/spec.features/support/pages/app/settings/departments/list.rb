module Pages
  module App::Settings
    module Departments
      class List < Pages::App::Base
        set_url('/settings/departments')

        element :add_new_department_button, :button, 'Add New Department'
        section :delete_modal, Sections::DeleteModal, '.ant-modal-content'
        sections :departments, '.ant-table-row-level-0' do
          element :name, :xpath, './td[1]'
          element :edit_button, :xpath, './td[2]//button[.="Edit"]'
          element :delete_button, :xpath, './td[2]//button[.="Delete"]'
        end

        section :department_form, '[role="dialog"]' do
          section :name, Sections::Input, :fillable_field, 'name'
          section :employees, Sections::Multiselect, :combobox, 'memberPks'
          element :save_button, :button, 'Save'
          element :cancel_button, :button, 'Cancel'
        end

        def get_department_by_name(name)
          departments.find{ |d| d.name.text == name }
        end
      end
    end
  end
end
