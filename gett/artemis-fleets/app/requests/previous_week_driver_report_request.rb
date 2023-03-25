class PreviousWeekDriverReportRequest < DriverReportRequest
  def request_key
    8
  end

  def local_records
    super.previous
  end

  def period
    "'#{1.week.ago.beginning_of_week.to_s(:db)}' AND '#{1.week.ago.end_of_week.to_s(:db)}'"
  end
end
