describe OrdersReportController do
  describe 'export' do
    context 'admin user' do
      let(:user) { create(:member, role: 'admin') }

      it 'returns data' do
        get :export, params: { token: token_for(user), from: '08-08-2017', to: '08-08-2017' }
        expect(response.status).to eq(200)
        expect(response.header['Content-Type']).to eql('text/csv')
        expect(response.body).to start_with('Order - ID,Booking - Status')
      end
    end

    context 'basic user' do
      let(:user) { create(:member, role: 'user') }

      it 'returns error' do
        expect{
          get :export, params: { token: token_for(user), from: '08-08-2017', to: '08-08-2017' }
        }.to raise_error(RuntimeError)
      end
    end
  end
end
