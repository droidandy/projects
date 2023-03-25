module Sections
  module Common::Bookings
    class Booking < Sections::Base
      element :expand_icon, :xpath, './td[1]/span', visible: false
      element :type, 'td.type'
      element :company_name, 'td.company-name'
      element :date_time, 'td.date-time'
      element :taxi_price, 'td.taxi-price'
      element :order_id, 'td.order-id'
      element :quote_cost, 'td.quote-cost'
      element :quote_price, 'td.quote-price'
      section :journey, 'td.journey' do
        element :pickup_address, :text_node, 'pickupAddressLine'
        element :destination_address, :text_node, 'destinationAddressLine'
      end
      element :supplier, 'td.supplier'
      element :passenger, 'td.passenger'
      element :total_cost, 'td.total-cost'
      element :payment_type, 'td.payment-type'
      element :vehicle_type, 'td.vehicle-type'
      element :recurring, 'td.recurring'
      element :status, 'td.status'
      element :eta, 'td.eta'
      section :details, Sections::Admin::Bookings::Details, :xpath, './following-sibling::tr[1]//div[@data-name="bookingDetails"]'

      def open_details
        date_time.click unless expanded?
        wait_until_details_visible(wait: 10)
      end

      alias expand open_details

      def close_details
        date_time.click if expanded?
        wait_until_details_invisible
      end

      def cancel
        # If page doen't have details section expanded - open it
        open_details if has_no_details?
        details.cancel_order.click
        wait_until_true { parent.has_cancel_modal? }
        parent.cancel_modal.yes_button.click
      end

      def expanded?
        next_row = root_element.first(:xpath, './following-sibling::tr[1]')
        next_row.present? && next_row[:class].include?('ant-table-expanded-row')
      end

      def passenger_name
        passenger&.text
      end

      def status_text
        status&.text
      end
    end
  end
end
