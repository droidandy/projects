module Sections
  module Admin::Companies
    class Details < SitePrism::Section
      element :edit_button, :button, 'edit'
      element :manage_bookings_button, :button, 'manage'
      element :activate_button, :button, 'activate'
      element :deactivate_button, :button, 'deactivate'
      element :destroy_button, :button, 'destroy'
      element :comments_button, :button, 'Comments'
      element :export_button, :button, 'Export'

      section :monthly_orders_chart, Sections::MonthlyChart, :text_node, 'monthly_orders_chart'
      section :completed_orders_by_car_type_chart, Sections::MonthlyChart, :text_node, 'completed_by_car_type_chart'
      section :monthly_spend_chart, Sections::MonthlyChart, :text_node, 'monthly_spend_chart'
      section :completed_orders_by_payment_type_chart, Sections::MonthlyChart, :text_node, 'completed_by_payment_type_chart'
      section :order_types_chart, :text_node, 'order_types_chart' do
        element :asap, :xpath, './/*[@class="recharts-layer" and contains(., "ASAP")]'
        element :future, :xpath, './/*[@class="recharts-layer" and contains(., "Future")]'
      end

      element :outstanding_balance, :text_node, 'outstanding_balance'

      def comments_count
        comments_button.text.scan(/\d/).first.to_i
      end
    end
  end
end
