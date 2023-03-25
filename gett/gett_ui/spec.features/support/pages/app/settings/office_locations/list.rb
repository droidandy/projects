module Pages
  module App::Settings
    module OfficeLocations
      class List < Pages::App::Base
        set_url('/settings/locations')

        element :add_office_location_button, :button, 'Add Office Location'
        section :delete_modal, Sections::DeleteModal, '.ant-modal-content'
        sections :locations, '.ant-table-row-level-0' do
          section :default, Sections::Checkbox, :checkbox, 'default'
          element :name, :xpath, './td[2]'
          element :address, :xpath, './td[3]'
          element :pickup_message, :xpath, './td[4]'
          element :destination_message, :xpath, './td[5]'
          element :edit_button, :xpath, './td[6]//button[.="Edit"]'
          element :delete_button, :xpath, './td[6]//button[.="Delete"]'
        end

        section :location_form, '[role="dialog"]' do
          section :name, Sections::Input, :fillable_field, 'name'
          section :address, Sections::Autocomplete, :combobox, 'address'
          section :pickup_message, Sections::Input, :fillable_field, 'pickupMessage'
          section :destination_message, Sections::Input, :fillable_field, 'destinationMessage'
          element :save_button, :button, 'Save'
          element :cancel_button, :button, 'Cancel'
        end

        def get_location_by_name(name)
          locations.find{ |ol| ol.name.text == name }
        end
      end
    end
  end
end
