class Admin::Sessions::Show < ApplicationService
  include ApplicationService::Context
  include ApplicationService::Policy

  delegate :admin, to: :context

  def execute!
    {
      id: admin.id,
      name: admin.full_name,
      user_role: admin.user_role_name,
      avatar_url: admin.avatar&.url,
      bookings_channel: Faye.channelize("bookings"),
      messages_channel: Faye.channelize("messages"),
      export_invoices_bunch_channel: Faye.channelize("export-invoices-bunch-#{context.admin.id}"),
      can: {
        see_notifications: policy.see_notifications?,
        see_statistics: policy.see_statistics?,
        see_predefined_addresses: policy.see_predefined_addresses?,
        see_system_settings: policy.see_system_settings?,
        see_billing: policy.see_billing?,
        create_users: policy.create_users?,
        toggle_company_status: policy.toggle_company_status?,
        manage_invoices: policy.manage_invoices?,
        edit_companies: policy.edit_companies?,
        see_companies: policy.see_companies?,
        see_bookings: policy.see_bookings?,
        see_users: policy.see_users?,
        manage_bookings_without_authorization: policy.manage_bookings_without_authorization?
      }
    }
  end
end
