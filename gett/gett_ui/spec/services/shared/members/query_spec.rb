require 'rails_helper'

RSpec.describe Shared::Members::Query, type: :service do
  let(:company) { create :company }
  let(:scope) { company.passengers_dataset }

  subject(:query) { described_class.new(query_params, scope: scope).resolved_scope.all }

  def create_passenger(first, last, email)
    create(:passenger,
      company: company, first_name: first, last_name: last, email: email,
      phone: '+0712341234'
    )
  end

  let!(:lil_wayne) { create_passenger('Lil', 'Wayne', 'lil@wayne.com') }
  let!(:lil_tunechi) { create_passenger('Lil', 'Tunechi', 'lil@tunechi.com') }
  let!(:dwayne_carter) { create_passenger('Dwayne', 'Carter', 'dwayne@carter.com') }

  describe 'query_by(:order)' do
    context 'when ordering by email' do
      let(:query_params) { { order: 'email' } }

      it { is_expected.to match_array [dwayne_carter, lil_tunechi, lil_wayne] }
    end
  end

  describe 'query_by(:search)' do
    describe 'first name' do
      let(:query_params) { { search: 'Lil' } }

      it { is_expected.to match_array [lil_wayne, lil_tunechi] }
    end

    describe 'last_name' do
      let(:query_params) { { search: 'Tunechi' } }

      it { is_expected.to eq [lil_tunechi] }
    end

    describe 'email' do
      let(:query_params) { { search: 'lil@way' } }

      it { is_expected.to eq [lil_wayne] }
    end

    describe 'phone' do
      let(:query_params) { { search: '071234' } }

      it { is_expected.to match_array [lil_wayne, lil_tunechi, dwayne_carter] }
    end

    describe 'full name' do
      let(:query_params) { { search: 'Lil W' } }

      it { is_expected.to eq [lil_wayne] }
    end

    describe 'full name in reverse' do
      let(:query_params) { { search: 'Carter Dw' } }

      it { is_expected.to eq [dwayne_carter] }
    end
  end
end
