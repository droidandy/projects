require 'rails_helper'

RSpec.describe Admin::Companies::Show, type: :service do
  let(:company) { create :company }

  describe '#execute' do
    subject(:service) { Admin::Companies::Show.new(company: company) }

    specify { expect(service.execute).to be_success }

    describe 'result' do
      it 'includes necessary properties' do
        expect(service.execute.result).to include(
          :can_destroy, :comments_count, 'credit_rate_status', 'country_code'
        )
      end

      describe ':can_destroy' do
        before do
          expect(company).to receive(:destroyable?).and_return(destroyable)
          service.execute
        end

        subject { service.result[:can_destroy] }

        context 'when company is destroyable' do
          let(:destroyable) { true }
          it { is_expected.to be true }
        end

        context 'when company is not destroyable' do
          let(:destroyable) { false }
          it { is_expected.to be false }
        end
      end
    end
  end
end
