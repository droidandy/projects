describe FleetReportRequest do
  subject { described_class.new(5) }

  it 'returns fleet report' do
    result = subject.execute.to_a
  end
end
