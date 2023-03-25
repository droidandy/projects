describe Admin::CompaniesController do
  let(:user) { create(:administrator) }

  describe 'index' do
    before { create_list(:company, 2) }

    it 'lists companies' do
      get :index, params: {token: token_for(user)}
      expect(response.status).to eq 200
      expect(parsed_body.count).to eq 2
    end
  end

  describe 'edit' do
    let(:company) { create(:company) }
    before { create(:member, company: company)  }

    it 'returns company attributes' do
      get :edit, params: {id: company.id, token: token_for(user)}
      expect(response.status).to eq 200
      expect(parsed_body.keys).to eq %w(id name salesman_id vat_number cost_centre legal_name fleet_id logo_url admin address legal_address)
    end
  end

  describe 'create' do
    it 'creates company and an admin member' do
      post :create, params: {
        token: token_for(user),
        company: {
          name: 'Evil Inc.',
          fleet_id: 1,
          admin: {
            first_name: 'John',
            last_name: 'Doe',
            password: 'Secure_Password',
            email: 'm@il.com',
            phone: '123 456 789'
          },
          address: {
            line: 'address',
            lat: 1.0,
            lng: 1.0,
            postal_code: 'A1 A11'
          },
          legal_address: {
            line: 'legal address',
            lat: 1.0,
            lng: 1.0,
            postal_code: 'A1 A11'
          }
        }
      }

      expect(response.status).to eq 200
      company = Company.last
      expect(company.name).to eq 'Evil Inc.'
      expect(company.admin.email).to eq('m@il.com')
      expect(company.admin.authenticate('Secure_Password')).to be_present
      expect(company.address.line).to eq('address')
      expect(company.legal_address.line).to eq('legal address')
    end
  end

  describe 'update' do
    let(:company) { create(:company) }
    before { create(:member, company: company)  }

    it 'updates company and admin member' do
      put :update, params: {
        id: company.id,
        token: token_for(user),
        company: {
          name: 'Evil Inc.',
          admin: {
            password: 'Secure_Password',
            email: 'm@il.com'
          },
          address: {
            line: 'address',
            lat: 1.0,
            lng: 1.0,
            postal_code: 'A1 A11'
          },
          legal_address: {
            line: 'legal address',
            lat: 1.0,
            lng: 1.0,
            postal_code: 'A1 A11'
          }
        }
      }

      expect(response.status).to eq 200
      company.reload
      expect(company.name).to eq 'Evil Inc.'
      expect(company.admin.email).to eq('m@il.com')
      expect(company.admin.authenticate('Secure_Password')).to be_present
      expect(company.address.line).to eq('address')
      expect(company.legal_address.line).to eq('legal address')
    end
  end

  describe 'destroy' do
    let(:company) { create(:company) }
    before { create(:member, company: company)  }

    it 'destroys company and members' do
      delete :destroy, params: {id: company.id, token: token_for(user)}
      expect(response.status).to eq 200
      expect(Company.exists?(company.id)).to eq false
    end
  end

  describe 'toggle_status' do
    let(:company) { create(:company) }

    it 'toggles active status of a company' do
      put :toggle_status, params: {id: company.id, token: token_for(user)}
      expect(response.status).to eq 200
      expect(company.reload).to_not be_active
    end
  end
end
