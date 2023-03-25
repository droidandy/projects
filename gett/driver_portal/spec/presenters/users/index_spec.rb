require 'rails_helper'

RSpec.describe Users::Index do
  describe '#as_json' do
    let!(:users) do
      create_list(:user, 3)
    end

    subject { described_class.new(User.page(2).per(2)).as_json }

    it { expect(subject[:total]).to eq(3) }
    it { expect(subject[:page]).to eq(2) }
    it { expect(subject[:per_page]).to eq(2) }
  end
end
