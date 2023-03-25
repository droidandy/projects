module Earnings
  class ShareCSV < ApplicationService
    schema do
      required(:driver).filled
      required(:from).filled(:date_time?)
      required(:to).filled(:date_time?)
      optional(:external_ids).maybe(:array?)
      required(:emails).filled(:array?)
      required(:body).filled(:str?)
    end

    def execute!
      compose(
        Earnings::GenerateCSV.new(
          current_user,
          driver: driver,
          from: from,
          to: to,
          external_ids: external_ids
        ),
        :csv
      )
      return unless @csv

      EarningsMailer.share(current_user, @csv, emails, body).deliver_now
      success!
    end
  end
end
