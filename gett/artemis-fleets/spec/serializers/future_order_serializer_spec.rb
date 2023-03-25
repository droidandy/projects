RSpec.describe FutureOrderSerializer, type: :serializer do
  let(:order) do
    request = ::FutureOrdersRequest.new(4)
    request.execute.to_a.first
  end

  let(:serializer) { described_class.new(order) }
  let(:serialization) { ActiveModelSerializers::Adapter.create(serializer) }

  let(:subject) { JSON.parse(serialization.to_json) }

  it 'has an id that matches' do
    expect(subject['id']).to eql(order.id)
  end

  it 'has an events field with details' do
    expect(subject['events']).to include('creating')
  end
end
