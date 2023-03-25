class Admin::Bookings::AuditLog < ApplicationService
  include ApplicationService::ChangesFetcher
  attributes :booking

  FIELD_MAPPING = {
    'Sms' => 'SMS',
    'Name' => 'Driver Name',
    'Rating' => 'Driver Rating',
    'Phone' => 'Driver Phone'
  }.freeze

  def execute!
    changes = changes(booking.versions) +
      changes(booking.driver&.versions) +
      charges_changes(booking.charges&.versions)

    sort_changes(changes)
  end

  private def charges_changes(versions)
    return [] if versions.blank?

    versions.flat_map do |version|
      version.changed['values']&.keys&.map do |key|
        from = "£#{version.changed['values'][key].first.to_f / 100}"
        to = "£#{version.changed['values'][key].last.to_f / 100}"
        create_result(version, key, from, to)
      end
    end
  end

  private def create_result(version, key, old, new)
    super.tap do |result|
      result[:field] = FIELD_MAPPING[result[:field]] if result[:field].in?(FIELD_MAPPING.keys)
      if result[:field] == 'Status'
        result[:from] = result[:from]&.titleize
        result[:to] = result[:to]&.titleize
      end
    end
  end
end
