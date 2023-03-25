module Sections
  module Admin
    class Invoice < SitePrism::Section
      element :company, :xpath, './td[1]'
      element :user, :xpath, './td[2]'
      element :invoice_date, :xpath, './td[3]'
      element :invoice_number, :xpath, './td[4]'
      element :amount, :xpath, './td[5]'
      element :status, :xpath, './td[6]'
      element :type, :xpath, './td[7]'
      element :payment_type, :xpath, './td[8]'
      element :transaction_id, :xpath, './td[9]'
      element :created_by, :xpath, './td[10]'
      element :due_date, :xpath, './td[12]'
      element :overdue_by, :xpath, './td[13]'
      element :actions, :xpath, './td[14]/div'

      section :actions_menu, :xpath, '//*[@role="menu"]' do
        element :mark_as_paid, :menu_item, 'Mark as Paid'
        element :disable_company, :menu_item, 'Disable Company'
      end
    end
  end
end
