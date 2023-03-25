# Service which load OT special requirements for company
#
# Examples:
#
# company = Company.first
# service = Companies::SyncSpecialRequirements.new(company: company)
# service.execute
# company.special_requirements => [#<SpecialRequirement ...]
#
class Companies::SyncSpecialRequirements < ApplicationService
  include ApplicationService::ModelMethods

  attributes :company

  def execute!
    return unless company.enterprise?

    transaction do
      company.remove_all_special_requirements

      ot_requirements.each do |requirement|
        company.add_special_requirement(requirement)
      end

      success!
    end
  end

  private def ot_requirements
    requirements =
      raw_ot_requirements.map do |raw_requirement|
        SpecialRequirement.find_or_create(
          service_type: Bookings::Providers::OT.to_s,
          key: raw_requirement[:key],
          label: raw_requirement[:label]
        )
      end

    requirements.compact
  end

  private def raw_ot_requirements
    OneTransport::ClientLookup.new(company: company)
      .execute
      .normalized_response
      .fetch(:requirements, [])
  end
end
