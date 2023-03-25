module Pages
  module App::Bookings
    class List < Pages::App::Base
      set_url('/bookings/{order}')
      include Mixings::Spinnable::Loader
      section :cancel_modal, Sections::CancelModal, '.ant-modal-content'

      section :service_feedback_modal, Sections::Modal, '.ant-modal-content' do
        elements :ratings, '[class*=rateItem]'
        element :selected_rating, '[class*=rateItem][class*=selected]'
        section :message, Sections::Input, '[data-name="message"]'

        def populate(rating = 10, msg = 'Very good service')
          pick_rating(rating)
          message.set msg
        end

        def pick_rating(rating)
          ratings[rating.to_i - 1]&.click
        end
      end

      sections :bookings, Sections::App::Bookings::Booking, '[class*=ant-table-row-level-0]'

      section :stop_points_modal, '.ant-modal-content' do
        sections :points, '[class*=ant-table-row-level-0]' do
          element :name, :xpath, './td[1]'
          element :phone, :xpath, './td[2]'
          element :address, :xpath, './td[3]'
        end
      end

      section :cancel_order_modal, '.ant-modal-content' do
        element :close_button, :button, 'No'
        element :cancel_order_button, :button, 'Yes'

        def submit
          cancel_order_button.click
        end
      end
    end
  end
end
