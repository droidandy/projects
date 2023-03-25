describe FutureOrdersRequest do
  subject { described_class.new(3) }

  it 'returns future orders' do
    result = subject.execute.to_a
  end
end
