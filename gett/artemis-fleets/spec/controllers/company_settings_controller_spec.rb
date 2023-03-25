describe CompanySettingsController do
  describe 'show' do
    let(:user) { create(:member) }
    let(:company) { user.company }

    it 'returns contacts attributes' do
      get :show, params: {token: token_for(user)}
      expect(parsed_body.keys).to eq %w(primary_contact billing_contact)
    end
  end

  describe 'update' do
    let(:company) { create(:company, primary_contact: nil, billing_contact: nil) }
    let(:user) { create(:member, company: company) }

    it 'updates contacts' do
      post :update, params: {
        token: token_for(user),
        company: {
          primary_contact: {
            first_name: 'John',
            last_name: 'Doe',
            address: {
              line: 'Address 1'
            }
          },
          billing_contact: {
            first_name: 'John',
            last_name: 'Doe',
            address: {
              line: 'Address 2'
            }
          }
        }
      }

      expect(response.status).to eq 200
      company.reload
      expect(company.primary_contact).to be_present
      expect(company.billing_contact).to be_present
      expect(company.primary_contact.address).to be_present
      expect(company.billing_contact.address).to be_present
    end
  end
end
