module Sections
  module Admin::AllUsers
    class Details < SitePrism::Section
      element :edit_button, :button, 'edit'
      section :daily_orders_chart, Sections::MonthlyChart, :text_node, 'dailyOrdersChart'
      section :daily_spend_chart, Sections::MonthlyChart, :text_node, 'dailySpendChart'
      element :avatar, :xpath, './/div[contains(@class, "Avatar")]'

      def has_avatar? # rubocop:disable Naming/PredicateName
        avatar.first(:xpath, './/img').present?
      end
    end
  end
end
