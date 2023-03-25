RSpec.describe Admin::Messages::Index do
  subject(:service) { described_class.new({}) }

  describe '#execute' do
    context 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
    end
  end
end
