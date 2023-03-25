describe OrdersCountRequest do
  let(:state) { nil }

  subject do
    described_class.new(4).tap do |instance|
      instance.state = state
    end
  end

  context ':active state' do
    let(:state) { :active }

    it 'returns count' do
      expect(
        subject.remote_records.first
      ).to include(:orders_count)
    end
  end

  context ':all state' do
    let(:state) { :all }

    it 'returns count' do
      expect(
        subject.remote_records.first
      ).to include(:orders_count)
    end
  end

  context ':future state' do
    let(:state) { :future }

    it 'returns count' do
      expect(
        subject.remote_records.first
      ).to include(:orders_count)
    end
  end

  context ':unknown state' do
    let(:state) { :unknown }

    it 'raise error' do
      expect {
        subject.remote_records.first
      }.to raise_error(RuntimeError)
    end
  end
end
