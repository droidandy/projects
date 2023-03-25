module Pages
  module Admin::Companies
    class Edit < Pages::Admin::Companies::Form
      set_url('/admin/company/{id}/edit')
      load_validation do
        [company_name.value.present?, 'data is not loaded']
      end

      def fill_in_admin_credentials(user)
        first_name.set(user.first_name)
        second_name.set(user.last_name)
        phone_number.set(user.phone)
        email.set(user.email)
      end

      element :pricing_tab, 'div[role="tab"]', text: 'Pricing'
      element :add_new_price_rule, :button, text: 'Add New Price Rule'
      element :copy_pricing, :button, text: 'Copy Pricing'

      class CopyPricingRuleModal < Sections::Modal
        section :company, Sections::Combobox, '[data-name="companyId"]'
      end
      section :copy_pricing_modal, CopyPricingRuleModal, '.ant-modal-content'

      section :new_price_rule_modal, Sections::Admin::Companies::NewPriceRuleModal, '.ant-modal-content'

      sections :price_rules, '.ant-table-row' do
        element :name, '.price-rule-name'
        element :pickup, '.price-rule-pickup'
        element :destination, '.price-rule-destination'
        section :vehicle_types, '.price-rule-vehicle-type' do
          elements :_vehicle_types, 'img'
          def types
            _vehicle_types.map { |t| t['alt'] }
          end
        end
        element :type, '.price-rule-type'
        section :active, Sections::Checkbox, '.price-rule-active .ant-checkbox'
        element :edit, :button, text: 'Edit'
        element :delete, :button, text: 'Delete'
      end
    end
  end
end
