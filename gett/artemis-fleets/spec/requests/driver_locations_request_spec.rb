describe DriverLocationsRequest do
  subject { described_class.new(4) }

  it 'returns driver locations' do
    result = subject.execute.to_a
  end
end
