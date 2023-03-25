require 'rails_helper'

RSpec.describe DirectDebitPayment, type: :model do
  it { is_expected.to validate_presence(:invoice) }
  it { is_expected.to validate_presence(:direct_debit_mandate) }
  it { is_expected.to validate_presence(:go_cardless_payment_id) }
  it { is_expected.to validate_presence(:amount_cents) }
  it { is_expected.to validate_presence(:currency) }
  it { is_expected.to validate_presence(:status) }
end
