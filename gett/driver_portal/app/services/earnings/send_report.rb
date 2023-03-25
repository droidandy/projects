module Earnings
  class SendReport < ApplicationService
    schema do
      required(:driver).filled
      required(:from).filled(:date_time?)
      required(:to).filled(:date_time?)
      optional(:external_ids).maybe(:array?)
    end

    def execute!
      compose(Earnings::GenerateCSV.new(current_user, @args), :csv)
      return unless @csv

      EarningsMailer.report(current_user, @csv).deliver_now
      success!
    end
  end
end
