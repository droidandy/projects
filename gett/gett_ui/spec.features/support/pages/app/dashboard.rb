module Pages
  module App
    class Dashboard < Pages::App::Base
      set_url('/dashboard')

      element :total_number_of_booking_taken, :text_node, 'totalTaken'
      element :total_spend, :text_node, 'totalSpend'
      element :number_of_living_bookings, :text_node, 'liveNumber'
      element :number_of_future_orders, :text_node, 'futureNumber'

      section :monthly_completed_cancelled_orders_chart, Sections::MonthlyChart, :text_node, 'monthly_completed_cancelled_orders_chart'
      section :internal_message, :text_node, 'internalMessage' do
        section :message_field, Sections::Input, :field, 'body'
      end
    end
  end
end
