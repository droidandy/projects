module Shared
  class ExportablePeriods < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    def execute!
      { items: items }
    end

    private def items
      objects_dataset.select{ |r| r.date_trunc('month', timestamp_column).as(:date) }
        .group_by(:date)
        .order(:date)
        .with_row_proc(->(r){ r[:date].to_date })
        .all
        .map{ |date| {value: date.strftime('%Y/%m'), label: I18n.l(date, format: :year_month)} }
    end

    private def timestamp_column
      :created_at
    end
  end
end
