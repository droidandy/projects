describe DriverReportRequest do
  it 'returns driver report' do
    PreviousWeekDriverReportRequest.new(5).execute.to_a
    CurrentWeekDriverReportRequest.new(5).execute.to_a
  end
end
