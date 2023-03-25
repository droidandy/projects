describe OrdersReportRequest do
  let(:date) { Date.new(2017,8,8) }

  subject do
    described_class.new(4).tap do |instance|
      instance.from_date = date
      instance.to_date = date
    end
  end

  it 'returned column names match stored names' do
    expect(
      subject.remote_records.first.keys.collect(&:to_sym)
    ).to eq(subject.columns)
  end
end
