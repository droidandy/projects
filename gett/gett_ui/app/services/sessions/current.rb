using Sequel::CoreRefinements

class Sessions::Current < ApplicationService
  include ApplicationService::Policy

  # we can have logged-in admin (User record), which is reincarnated as some company's
  # member (Member record). in that case both are set, and are related to different
  # records. in case there is logged in company member, `user` and `member` are same.
  attributes :member, :user
  delegate :company, to: :member

  def execute!
    {
      email: member.email,
      name: member.full_name,
      member_id: member.id,
      reincarnated: member.id != user.id,
      guide_passed: member.guide_passed,
      # onboarding is temporarily disabled on production
      # onboarding should not be triggered for reincarnated admin.
      onboarding: !Rails.env.production? && user.try(:onboarding),
      import_channel: Faye.channelize("import-#{member.id}"),
      bookings_channel: Faye.channelize("bookings-#{company.id}"),
      internal_messages_channel: Faye.channelize("messages-#{company.id}"),
      export_invoices_bunch_channel: Faye.channelize("export-invoices-bunch-#{member.id}"),
      export_receipts_bunch_channel: Faye.channelize("export-receipts-bunch-#{member.id}"),
      external_messages_channel: Faye.channelize("messages"),
      personal_messages_channel: Faye.channelize("messages-#{member.id}"),
      warning: payment_warning,
      is_affiliate: company.affiliate?,
      is_bbc: company.bbc?,
      company_id: company.id,
      bookings_validation_enabled: company.bookings_validation_enabled?,
      active_bookings_info_channel: Faye.channelize("active-bookings-info-#{member.id}"),
      layout: {
        company_name:  company.name,
        logo_url:      company.logo&.url,
        address:       company.address&.as_json,
        company_phone: company.primary_contact&.phone,
        avatar_url:    member.avatar&.url
      },
      can: {
        see_bookers: policy.see_bookers?,
        administrate_company: policy.administrate_company?,
        manage_travel_policies: policy.manage_travel_policies?,
        manage_travel_reasons: policy.manage_travel_reasons?,
        manage_finance: can_manage_finance?,
        manage_report_settings: policy.manage_report_settings?,
        see_statistics: policy.see_statistics?,
        see_procurement_statistics: policy.see_statistics? && company.linked_companies.present?,
        create_passengers: policy.create_passengers?,
        export_bookings: policy.export_bookings?,
        export_receipts: policy.export_receipts?
      }
    }
  end

  def policy_user
    member
  end

  private def can_manage_finance?
    policy.manage_finance? && company.payment_types != ['passenger_payment_card']
  end

  private def payment_warning
    return unless company.payment_options&.invoice_payment_type == 'company_payment_card'
    return unless member.executive? || member.finance?

    invoices_with_failed_payments = company.invoices_dataset.outstanding.where(
      Payment.failed
        .association_join(:invoices.as(:payment_invoices))
        .where(invoice_id: :invoices[:id])
        .select(1).exists
    )

    last_payment_failed =
      invoices_with_failed_payments.any? do |invoice|
        invoice.payments_dataset.order(:created_at).last.failed?
      end

    'Your last payment failed, please update you card info.' if last_payment_failed
  end
end
