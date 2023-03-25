module Pages
  module App::Settings
    module TravelPolicy
      class List < Pages::App::Base
        set_url('/settings/travel-policy')

        element :add_new_rule_button, :button, 'Add new policy'
        section :delete_modal, Sections::DeleteModal, '.ant-modal-content'

        sections :rules, :text_node, 'travelPolicy' do
          element :dragndrop, :xpath, './*[@data-name="dragHandle"]//div'
          section :active, Sections::Switcher, '[data-name="active"]'
          element :priority, :text_node, 'priority'
          element :rule, :text_node, 'ruleName'
          element :edit_button, :button, 'Edit'
          element :delete_button, :button, 'Delete'

          def change_priority_with(target)
            dragndrop.drag_to(target.dragndrop)
          end
        end

        section :rule_form, '[role="dialog"]' do
          section :name, Sections::Input, :fillable_field, 'name'
          section :departments, Sections::Multiselect, :combobox, 'departmentPks'
          section :work_roles, Sections::Multiselect, :combobox, 'workRolePks'
          section :users, Sections::Multiselect, :combobox, 'memberPks'
          section :guest_passenger, Sections::Checkbox, :checkbox, 'allowUnregistered'
          section :location, Sections::Combobox, :combobox, 'location'
          section :distance_more_than, Sections::Input, :fillable_field, 'minDistance'
          section :distance_less_than, Sections::Input, :fillable_field, 'maxDistance'
          section :monday, Sections::Checkbox, :checkbox, 'monday'
          section :tuesday, Sections::Checkbox, :checkbox, 'tuesday'
          section :wednesday, Sections::Checkbox, :checkbox, 'wednesday'
          section :thursday, Sections::Checkbox, :checkbox, 'thursday'
          section :friday, Sections::Checkbox, :checkbox, 'friday'
          section :saturday, Sections::Checkbox, :checkbox, 'saturday'
          section :sunday, Sections::Checkbox, :checkbox, 'sunday'
          section :time_after, Sections::TimePicker, :text_node, 'minTime'
          section :time_before, Sections::TimePicker, :text_node, 'maxTime'
          section :car_types, Sections::CarTypesCheckboxList, :text_node, 'carTypes'
          section :cheapest, Sections::Checkbox, :checkbox, 'cheapest'
          element :save_button, :button, 'Save Travel Policy'
          element :cancel_button, :button, 'Cancel'
        end

        def get_rule_by_name(name)
          rules.find{ |r| r.name.text == name }
        end
      end
    end
  end
end
