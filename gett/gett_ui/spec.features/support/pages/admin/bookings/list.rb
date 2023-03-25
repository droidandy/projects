module Pages
  module Admin::Bookings
    class List < Pages::Admin::Base
      set_url('/admin/bookings{/order}')

      sections :bookings, Sections::Admin::Bookings::Booking, '[class*=ant-table-row-level-0]'

      section :history_modal, Sections::Admin::Bookings::OrderHistoryModal, '.ant-modal-content'

      section :tabs, :text_node, 'bookingTabs' do
        element :active, :text_node, 'active'
        element :future, :text_node, 'future'
        element :completed, :text_node, 'completed'
        element :affiliate, :text_node, 'affiliate'
        element :enterprise, :text_node, 'enterprise'
        element :all, :text_node, 'all'
        element :alert, :text_node, 'alert'
        element :critical, :text_node, 'critical'
      end

      section :comments_modal, '.ant-modal-content' do
        section :message_field, Sections::Input, :field, 'commentMessage'
        element :add_comment_button, :button, 'Add Comment'

        sections :comments, :text_node, 'comment' do
          element :author, :text_node, 'commentAuthor'
          element :message, :text_node, 'commentText'
        end

        def add_comment(text)
          message_field.set(text)
          add_comment_button.click
        end
      end

      def find_by_passenger(name)
        bookings.find{ |b| b.passenger_name.include? name }
      end

      section :send_message_modal, Sections::Modal, '.ant-modal-content' do
        section :phones, Sections::Multiselect, '[role="combobox"]'
        element :text,   'textarea'
        element :send_button, :button, 'Send'
      end

      section :critical_flag_modal, Sections::Modal, '.ant-modal-content' do
        section :critical_flag_checkbox, Sections::Checkbox, :checkbox, 'criticalFlag'
      end

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
        element :add_cancellation_fee, :switcher, 'cancellationFee'

        def submit
          cancel_order_button.click
        end
      end
    end
  end
end
