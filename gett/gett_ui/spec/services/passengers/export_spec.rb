require 'rails_helper'

RSpec.describe Passengers::Export, type: :service do
  it { is_expected.to be_authorized_by(Passengers::ExportPolicy) }

  describe '#execute' do
    let(:company) { create(:company) }

    service_context { { member: booker } }

    let(:booker) do
      create(:booker,
        company: company,
        first_name: 'Bob',
        last_name: 'Hoskins',
        mobile: '+380995555599',
        email: 'bob@hotmail.com',
        passenger_pks: [passenger.id],
        department: booker_department,
        work_role: booker_work_role,
        payroll: '234',
        cost_centre: '321',
        division: '765'
      )
    end
    let(:passenger) do
      create(:passenger,
        company: company,
        first_name: 'Sofia',
        last_name: 'Asistores',
        mobile: '+380995555599',
        email: 'sofia@hotmail.com',
        department: passenger_department,
        work_role: passenger_work_role,
        payroll: '234',
        cost_centre: '321',
        division: '765'
      )
    end

    let(:booker_department)    { create(:department, company: company, name: "Sales") }
    let(:passenger_department) { create(:department, company: company, name: "Fashion") }
    let(:booker_work_role)     { create(:work_role, company: company, name: "CEO") }
    let(:passenger_work_role)  { create(:work_role, company: company, name: "Model") }

    let(:service) { Passengers::Export.new }

    it { is_expected.to use_policy_scope }

    before do
      create(:passenger_address, :home, passenger: booker, address_line: 'Baker 1')
      create(:passenger_address, :work, passenger: booker, address_line: 'Baker 2')
      create(:passenger_address, :home, passenger: passenger, address_line: 'Baker 3')
      create(:passenger_address, :work, passenger: passenger, address_line: 'Baker 4')
    end

    describe 'execution result' do
      let(:result) { CSV.parse(service.execute.result) }

      it 'returns csv string only with headers and 2 members: 1 booker and 1 passenger' do
        expect(result.length).to eq 3
      end

      it 'returns csv with correct headers' do
        expect(result[0]).to eq([
          "Id",
          "Passenger name",
          "Phone number",
          "Mobile number",
          "Email",
          "Bookers",
          "Department",
          "User role",
          "Work role",
          "Home address",
          "Work address",
          "Status",
          "Payroll ID",
          "Cost Centre",
          "Division"
        ])
      end

      it 'returns correct booker data' do
        expect(result[1]).to eq([
          booker.id.to_s,
          "Bob Hoskins",
          "+380995555555",
          "+380995555599",
          "bob@hotmail.com",
          "",
          "Sales",
          "booker",
          "CEO",
          "Baker 1",
          "Baker 2",
          "Active",
          "234",
          "321",
          "765"
        ])
      end

      it 'returns correct passenger data' do
        expect(result[2]).to eq([
          passenger.id.to_s,
          "Sofia Asistores",
          "+380995555555",
          "+380995555599",
          "sofia@hotmail.com",
          "Bob Hoskins",
          "Fashion",
          "passenger",
          "Model",
          "Baker 3",
          "Baker 4",
          "Active",
          "234",
          "321",
          "765"
        ])
      end

      context 'when home address should be sanitized' do
        service_context { {member: booker, front_office: true, sanitize_home_address: true} }

        it 'sanitizes home addresses' do
          expect(result[1][9]).to eq('Home')
          expect(result[2][9]).to eq('Home')
        end
      end
    end
  end
end
