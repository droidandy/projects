require 'rails_helper'

RSpec.describe DirectDebitMandate, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence(:company) }
    it { is_expected.to validate_presence(:created_by) }
    it { is_expected.to validate_presence(:go_cardless_redirect_flow_id) }
    it { is_expected.to validate_presence(:status) }

    context 'active mandate' do
      subject { DirectDebitMandate.new(status: DirectDebitMandate::ACTIVE) }

      it { is_expected.to validate_presence(:go_cardless_mandate_id) }
    end
  end
end
