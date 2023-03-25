module Pages
  module Admin
    class Statistics < Pages::Admin::Base
      set_url('/admin/statistics')
      section :enterprise_active_orders, :text_node, 'enterprise_active_orders' do
        element :asap, :text_node, 'asap'
        element :future, :text_node, 'future'
      end

      section :affiliate_active_orders, :text_node, 'affiliate_active_orders' do
        element :asap, :text_node, 'asap'
        element :future, :text_node, 'future'
      end

      section :enterprise_today, :text_node, 'enterprise_today' do
        element :completed, :text_node, 'completed'
        element :cancelled, :text_node, 'cancelled'
      end

      section :affiliate_today, :text_node, 'affiliate_today' do
        element :completed, :text_node, 'completed'
        element :cancelled, :text_node, 'cancelled'
      end

      section :ot_vs_gett_completed_today, :text_node, 'ot_vs_gett_completed_today' do
        element :gett, :text_node, 'gett'
        element :ot, :text_node, 'ot'
      end

      section :international_order_today, :text_node, 'international_order_today' do
        element :completed, :text_node, 'completed'
        element :cancelled, :text_node, 'cancelled'
      end

      section :cash_order_today, :text_node, 'cash_order_today' do
        element :completed, :text_node, 'completed'
        element :cancelled, :text_node, 'cancelled'
      end

      section :account_order_today, :text_node, 'account_order_today' do
        element :completed, :text_node, 'completed'
        element :cancelled, :text_node, 'cancelled'
      end

      section :credit_card_order_today, :text_node, 'credit_card_order_today' do
        element :completed, :text_node, 'completed'
        element :cancelled, :text_node, 'cancelled'
      end

      section :active_bookers_today, :text_node, 'active_bookers_today' do
        element :enterprise, :text_node, 'enterprise'
        element :affiliate, :text_node, 'affiliate'
      end

      section :riding_users_today, :text_node, 'riding_users_today' do
        element :enterprise, :text_node, 'enterprise'
        element :affiliate, :text_node, 'affiliate'
      end

      section :riding_companies_today, :text_node, 'riding_companies_today' do
        element :enterprise, :text_node, 'enterprise'
        element :affiliate, :text_node, 'affiliate'
      end

      section :first_time_riders, :text_node, 'first_time_riders' do
        element :enterprise, :text_node, 'enterprise'
        element :affiliate, :text_node, 'affiliate'
      end

      section :avg_rating_today, :text_node, 'avg_rating_today' do
        element :driver, :text_node, 'driver'
        element :service, :text_node, 'service'
      end

      section :enterprise_monthly_orders_chart, Sections::MonthlyChart, :text_node, 'enterprise_monthly_orders_chart'
      section :affiliate_monthly_orders_chart, Sections::MonthlyChart, :text_node, 'affiliate_monthly_orders_chart'
    end
  end
end
