describe Export::CreateCsv do
  let(:remote_records) do
    [
      {'Order - Id' => 123, 'Driver Name' => 'Test'},
      {'Order - Id' => 456, 'Driver Name' => 'Test2'}
    ]
  end

  let(:csv_headers) do
    [:'Order - Id', :'Driver Name']
  end

  subject { described_class.new(remote_records, csv_headers) }

  context '#execute' do
    it 'assign csv content to varable' do
      subject.execute!
      expect(subject.result).to eq(
        "Order - Id,Driver Name\n123,Test\n456,Test2\n"
      )
    end
  end
end
