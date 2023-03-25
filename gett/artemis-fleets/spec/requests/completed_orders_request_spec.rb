describe CompletedOrdersRequest do
  subject { described_class.new(4) }

  it 'returns completed orders' do
    expect(subject.execute.to_a).to be_a(Array)
  end

  describe 'with date filters' do
    before do
      subject.date_from = Date.new(2017, 10, 23)
      subject.date_to = Date.new(2017, 10, 25)
    end

    it 'return valid records number' do
      expect(subject.remote_records.size).to eq(699)
    end
  end
end
