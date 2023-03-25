module Sections
  module App::Passengers
    class Details < SitePrism::Section
      element :edit_button, :button, 'edit'
      section :daily_orders_chart, Sections::MonthlyChart, :text_node, 'dailyOrdersChart'
      section :daily_spend_chart, Sections::MonthlyChart, :text_node, 'dailySpendChart'
    end
  end
end
