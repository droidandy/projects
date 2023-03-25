require 'rest-client'

module GettEarningsApi
  class Client < BaseClient
    def earnings(driver_id:, from:, to:)
      params = { from: from, to: to }

      call("drivers/#{driver_id}/earnings", params)
    end
  end
end
