describe ActiveOrdersRequest do
  subject { described_class.new(4) }

  it 'returns active orders' do
    result = subject.execute.to_a
  end
end
