require 'rails_helper'

RSpec.describe Admin::Sessions::Show, type: :service do
  let(:service)      { Admin::Sessions::Show.new }
  let(:admin)        { create(:user, :admin, avatar: base64_image) }
  let(:base64_image) { Rails.root.join('spec/fixtures/small_image.gif.urlData').read }

  service_context { { admin: admin } }

  describe '#execute' do
    before do
      expect(Faye).to receive(:channelize).with('bookings').and_return('bookings-channel')
      expect(Faye).to receive(:channelize).with('messages').and_return('messages-channel')
      expect(Faye).to receive(:channelize).with("export-invoices-bunch-#{admin.id}").and_return('export-invoices-bunch-channel')
    end

    it 'returns result with expected information' do
      expect(service.execute.result).to match(
        bookings_channel: 'bookings-channel',
        messages_channel: 'messages-channel',
        export_invoices_bunch_channel: 'export-invoices-bunch-channel',
        name: admin.full_name,
        id: admin.id,
        avatar_url: instance_of(String),
        user_role: 'admin',
        can: {
          see_notifications: true,
          see_statistics: true,
          see_predefined_addresses: true,
          see_system_settings: true,
          see_billing: true,
          create_users: true,
          toggle_company_status: true,
          manage_invoices: true,
          edit_companies: true,
          see_companies: true,
          see_users: true,
          see_bookings: true,
          manage_bookings_without_authorization: true
        }
      )
    end
  end
end
