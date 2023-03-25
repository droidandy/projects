module Pages
  module Admin
    class Billing < Pages::Admin::Base
      set_url('/admin/settings/billing')
      sections :invoices, Sections::Admin::Invoice, '.ant-table-row-level-0'
    end
  end
end
