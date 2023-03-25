module Pages
  module App::Settings
    module Billing
      class List < Pages::App::Base
        set_url('/settings/billing')
        sections :invoices, Sections::App::Settings::Invoice, '.ant-table-row-level-0'
        section :new_payment, Sections::App::Settings::NewPayment, '.ant-modal-content'

        element :outstanding_balance, :text_node, 'outstandingBalance'
        element :pay_with_card_button, :button, 'Pay with card'

        def select_all_invoices
          find('.ant-table-selection input[type="checkbox"]', visible: false).click
        end
      end
    end
  end
end
