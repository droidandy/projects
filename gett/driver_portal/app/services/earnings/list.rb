module Earnings
  class List < ApplicationService
    attr_reader :earnings

    schema do
      required(:driver).filled
      required(:from).filled(:date_time?)
      required(:to).filled(:date_time?)
      optional(:page).filled(:int?)
      optional(:per_page).filled(:int?)
    end

    def execute!
      return unless paginated_earnings

      @earnings = paginated_earnings.map do |earning|
        Earnings::Parser.new(earning).parse
      end
      success!
    end

    private def paginated_earnings
      @paginated_earnings ||= if filtered_earnings && page && per_page
                                Kaminari.paginate_array(filtered_earnings).page(page).per(per_page)
                              else
                                filtered_earnings
                              end
    end

    private def filtered_earnings
      return unless raw_earnings
      # filter out earnings with zero amount and no related transactions with filled amount (which lead to zero total)
      @filtered_earnings ||= raw_earnings.reject do |earning|
        filled_transactions = Array.wrap(earning['related_transactions']).reject do |transaction|
          transaction['amount_inc_tax'].to_i.zero?
        end
        earning['amount_inc_tax'].to_i.zero? && filled_transactions.empty?
      end
    end

    private def raw_earnings
      @raw_earnings ||= if response.success?
                          response.body['transactions'] || []
                        else
                          fail!(errors: { data: 'was not retrieved' })
                          nil
                        end
    end

    private def response
      @response ||= client.earnings(driver_id: driver.gett_id, from: from, to: to)
    end

    private def client
      @client ||= GettEarningsApi::Client.new
    end
  end
end
