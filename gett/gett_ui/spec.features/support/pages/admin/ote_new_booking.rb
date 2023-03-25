module Pages
  module Admin
    class OteNewBooking < Pages::Admin::Base
      include Pages::Shared::BookingForm
      set_url('/admin/booking/new')

      section :company_selector, Sections::Combobox, :combobox, 'companySelect'
      element :next_button, :button, 'Next Step'

      section :order_id_modal, '.ant-modal-content' do
        element :ok_button, :button, 'OK'
      end
    end
  end
end
