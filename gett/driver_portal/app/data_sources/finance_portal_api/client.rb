require 'rest-client'

module FinancePortalApi
  class Client < BaseClient
    def drivers(limit:, page:)
      params = { limit: limit, page: page }

      call('drivers', params)
    end

    def statements( # rubocop:disable Metrics/ParameterLists
      from: nil,
      to: nil,
      at: nil,
      changed_after: nil,
      ids: [],
      driver_ids: [],
      order_ids: [],
      ids_only: false,
      limit: 10,
      page: 1
    )
      params = {
        from: format_time(from),
        to: format_time(to),
        at: format_time(at),
        changed_after: format_time(changed_after),
        ids: Array.wrap(ids).join(','),
        driver_ids: Array.wrap(driver_ids).join(','),
        order_ids: Array.wrap(order_ids).join(','),
        ids_only: ids_only,
        limit: limit,
        page: page
      }

      params.reject! { |_, v| v.blank? }

      call('statements', params)
    end

    def statement_html(id:)
      call("statements/#{id}/html")
    end

    def order(id:)
      call("orders/#{id}")
    end

    def orders( # rubocop:disable Metrics/ParameterLists
      from: nil,
      to: nil,
      ids: [],
      driver_ids: [],
      limit: 10,
      page: 1
    )
      params = {
        from: format_time(from),
        to: format_time(to),
        ids: Array.wrap(ids).join(','),
        driver_ids: Array.wrap(driver_ids).join(','),
        limit: limit,
        page: page
      }

      params.reject! { |_, v| v.blank? }

      call('orders', params)
    end

    def driver_stats(id:)
      call("drivers/#{id}/stats")
    end
  end
end
