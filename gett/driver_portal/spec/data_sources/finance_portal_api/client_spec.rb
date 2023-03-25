require 'rails_helper'

RSpec.describe FinancePortalApi::Client do
  let(:url) { Rails.application.secrets.finance_portal_api[:api_url] }
  let(:prefix) { Rails.application.secrets.finance_portal_api[:api_prefix] }
  let(:auth_path) { 'oauth/token' }
  let(:auth_success) { json_body('gett/auth') }
  subject { described_class.new }

  describe '#auth' do
    let(:path) { 'oauth/token' }
    let(:body) { json_body('gett/auth') }
    subject { described_class.new.auth }

    before(:each) { stub_request(:post, "#{url}#{path}").to_return(status: 200, body: body, headers: {}) }

    it 'returns auth details for valid credentials' do
        expect(subject.success?).to be_truthy
        expect(subject.body).to include(
          *%w[
            access_token
            created_at
            expires_in
            scope
            token_type
          ]
        )
    end
  end

  describe '#drivers' do
    let(:path) { "#{prefix}/drivers" }
    let(:body) { json_body('gett/finance_portal_api/drivers') }
    subject { described_class.new.drivers(params) }

    before(:each) {
      stub_auth(described_class)
      stub_request(:get, /#{url}#{path}/).to_return(status: 200, body: body, headers: {})
    }

    context 'has driver details' do
      let(:params) do
        { limit: 10, page: 1 }
      end

      it 'pass valid params' do
        subject
        expect(WebMock).to have_requested(:get, "#{url}#{path}").
          with(query: { limit: params[:limit], page: params[:page] })
      end

      it 'returns valid data' do
        expect(subject.body.count).to eq(4)
        expect(subject.body.first.keys).to include(
          *%w[
            id
            name
            email
            phone
            phone_type
            address
            city
            postcode
            account_number
            sort_code
            badge
            is_frozen
          ]
        )
      end
    end
  end
end
