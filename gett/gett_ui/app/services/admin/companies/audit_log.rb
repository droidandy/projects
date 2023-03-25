class Admin::Companies::AuditLog < ApplicationService
  include ApplicationService::ChangesFetcher
  attributes :company

  def execute!
    versions = company.versions +
      company.company_info.versions +
      company.payment_options.versions

    all_changes = changes(versions) +
      contact_changes(company.billing_contact&.versions, 'billing_contact') +
      contact_changes(company.primary_contact&.versions, 'primary_contact')

    sort_changes(all_changes)
  end

  private def contact_changes(versions, field_prefix)
    return [] if versions.blank?

    versions.flat_map do |version|
      version.changed['values']&.keys&.map do |key|
        field = "#{field_prefix}:_#{key}"
        old, new = version.changed['values'][key]

        create_result(version, field, old, new)
      end
    end
  end
end
