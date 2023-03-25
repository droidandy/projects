module Pages
  module App::Reports
    class ProcurementStatistics < Pages::App::Base
      set_url('/reports/procurement_statistics')

      section :completed_cancelled_orders_chart, Sections::MonthlyChart, :text_node, 'completed_cancelled_orders_chart'
      section :completed_orders_by_car_type_chart, Sections::MonthlyChart, :text_node, 'completed_orders_by_car_type_chart'
      section :spend_by_booking_type_chart, Sections::MonthlyChart, :text_node, 'spend_by_booking_type_chart'
      section :daily_spend_vs_prev_month_chart, Sections::MonthlyChart, :text_node, 'daily_spend_vs_prev_month_chart'
      section :completed_rides_by_city_chart, Sections::SpendChart, :text_node, 'completed_rides_by_city_chart'
      section :spend_by_city_chart, Sections::SpendChart, :text_node, 'spend_by_city_chart'
      section :waiting_time_by_city_chart, Sections::SpendChart, :text_node, 'waiting_time_by_city_chart'
      section :avg_ride_cost_per_vehicle_type_by_city_chart, Sections::SpendChart, :text_node, 'avg_ride_cost_per_vehicle_type_by_city_chart'
      section :completed_rides_all_companies_chart, Sections::SpendChart, :text_node, 'completed_rides_all_companies_chart'
      section :spend_all_companies_chart, Sections::SpendChart, :text_node, 'spend_all_companies_chart'
      section :waiting_cost_all_companies_chart, Sections::SpendChart, :text_node, 'waiting_cost_all_companies_chart'
      section :avg_ride_cost_per_vehicle_type_all_companies_chart, Sections::SpendChart, :text_node, 'avg_ride_cost_per_vehicle_type_all_companies_chart'
      section :completed_orders_by_car_type_pie_chart, Sections::PieChart, :text_node, 'completed_orders_by_car_type_pie_chart'
      section :completed_orders_by_future_asap_pie_chart, Sections::PieChart, :text_node, 'completed_orders_by_future_asap_pie_chart'
    end
  end
end
