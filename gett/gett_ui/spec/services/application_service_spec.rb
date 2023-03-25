require 'rails_helper'

RSpec.describe ApplicationService, type: :service do
  describe 'attributes' do
    let(:service_class) do
      Class.new(described_class) do
        attributes :foo, :bar
      end
    end

    subject(:service) { service_class.new(foo: 1, bar: true) }

    it 'raises error when initialized with unknown attributes' do
      expect{ service_class.new(baz: 2) }.to raise_error(ArgumentError, /cannot initialize/)
    end

    it 'has attribute reader methods, including boolean ones' do
      expect(service.foo).to eq 1
      expect(service.bar?).to be true
    end
  end
end
