module Pages
  module App::Settings
    module UserRoles
      class List < Pages::App::Base
        set_url('/settings/work-roles')

        element :add_new_user_role_button, :button, 'Create role'
        section :delete_modal, Sections::DeleteModal, '.ant-modal-content'
        sections :user_roles, '.ant-table-row-level-0' do
          element :name, :xpath, './td[1]'
          element :edit_button, :xpath, './td[2]//button[.="Edit"]'
          element :delete_button, :xpath, './td[2]//button[.="Delete"]'
        end

        section :user_role_form, '[role="dialog"]' do
          section :name, Sections::Input, :fillable_field, 'name'
          section :employees, Sections::Combobox, :combobox, 'memberPks'
          element :save_button, :button, 'Save'
          element :cancel_button, :button, 'Cancel'
        end

        def get_user_role_by_name(name)
          user_roles.find{ |d| d.name.text == name }
        end
      end
    end
  end
end
