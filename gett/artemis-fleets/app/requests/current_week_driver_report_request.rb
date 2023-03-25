class CurrentWeekDriverReportRequest < DriverReportRequest
  def request_key
    7
  end

  def local_records
    super.current
  end

  def period
    "'#{Time.current.beginning_of_week.to_s(:db)}' AND '#{Time.current.to_s(:db)}'"
  end
end
