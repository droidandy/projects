describe CompaniesController do
  let(:company) { create(:company) }
  let(:user) { create(:member, company: company) }

  describe 'show' do
    it 'returns company details' do
      get :show, params: {token: token_for(user)}
      expect(response.status).to eq 200
      expect(parsed_body.keys).to eq %w(name logo_url orders_count internal_messages external_messages order_counts)
    end
  end

  describe 'update' do
    it 'updates company' do
      put :update, params: {company: {logo: nil}, token: token_for(user)}
      expect(response.status).to eq 200
    end
  end
end
