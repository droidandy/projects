module Pages
  module Admin::POI
    class List < Pages::Admin::Base
      set_url('/admin/settings/poi')

      element :add_new_poi_button, :button, 'Add New POI'
      section :delete_modal, Sections::DeleteModal, '.ant-modal-content'
      sections :pois, '.ant-table-row-level-0' do
        element :name, :xpath, './td[1]'
        element :edit_button, :xpath, './td[2]//button[.="Edit"]'
        element :delete_button, :xpath, './td[2]//button[.="Delete"]'
      end

      section :poi_form, '[role="dialog"]' do
        section :name, Sections::Input, :fillable_field, 'line'
        section :postal_code, Sections::Input, :fillable_field, 'postalCode'
        section :latitude, Sections::Input, :fillable_field, 'lat'
        section :longitude, Sections::Input, :fillable_field, 'lng'
        section :city, Sections::Input, :fillable_field, 'city'
        section :terms, Sections::Input, :fillable_field, 'additionalTerms'
        element :verify_button, :button, 'Verify'
        element :save_button, :button, 'Save'
        element :cancel_button, :button, 'Cancel'
      end

      def get_poi_by_name(name)
        pois.find{ |p| p.name.text == name }
      end
    end
  end
end
