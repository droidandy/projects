module Pages
  module App::Settings
    module ReasonForTravel
      class List < Pages::App::Base
        set_url('/settings/reason-for-travel')

        element :add_new_reason_for_travel_button, :button, 'Add New Reason for Travel'
        section :delete_modal, Sections::DeleteModal, '.ant-modal-content'
        sections :reasons, '.ant-table-row-level-0' do
          element :name, :xpath, './td[1]'
          section :active, Sections::Checkbox, :checkbox, 'active'
          element :edit_button, :xpath, './td[3]//button[.="Edit"]'
          element :delete_button, :xpath, './td[3]//button[.="Delete"]'
        end

        section :reason_form, '[role="dialog"]' do
          section :name, Sections::Input, :fillable_field, 'name'
          element :save_button, :button, 'Save'
          element :cancel_button, :button, 'Cancel'
        end

        def get_reason_by_name(name)
          reasons.find{ |r| r.name.text == name }
        end
      end
    end
  end
end
