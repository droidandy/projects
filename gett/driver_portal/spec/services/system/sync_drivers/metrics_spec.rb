require 'rails_helper'

RSpec.describe System::SyncDrivers::Metrics do
  describe '#execute!' do
    context 'with two drivers' do
      let!(:user_1) { create(:user, gett_id: 1) }
      let!(:user_2) { create(:user, gett_id: 2) }
      let(:drivers) do
        [
          {
            id: 2,
            license_number: 'LV02 HJN',
            rating: 4.93,
            today_acceptance: nil,
            week_acceptance: 0,
            month_acceptance: 77,
            total_acceptance: 42
          },
          { id: 3, rating: 4 },
        ]
      end

      before(:each) do
        stub_service(Drivers::Fleet::List, drivers: drivers)
      end

      it 'executes successfully' do
        subject.execute!
        expect(subject).to be_success
      end

      it 'updates one user' do
        expect { subject.execute! }.to change { user_2.metrics.count }
      end

      it 'saves valid data' do
        subject.execute!
        expect(user_2.last_metric.rating).to eq(4.93)
        expect(user_2.last_metric.today_acceptance).to eq(nil)
        expect(user_2.last_metric.week_acceptance).to eq(0)
        expect(user_2.last_metric.month_acceptance).to eq(77)
        expect(user_2.last_metric.total_acceptance).to eq(42)
      end

      it 'does not touch another user' do
        expect { subject.execute! }.not_to change { user_1.metrics.count }
      end
    end

    context 'with users enough for pagination' do
      let!(:users) { create_list(:user, 12, :with_driver_role) }

      it 'should call drivers list twice' do
        expect(Drivers::Fleet::List).to receive(:new)
          .twice
          .and_return(double(Drivers::Fleet::List, execute!: true, success?: true, drivers: []))
        subject.execute!
      end
    end
  end
end
