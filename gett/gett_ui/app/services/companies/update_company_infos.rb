using Sequel::CoreRefinements

module Companies
  # UpdateCompanyInfos is a helper service, not triggered from UI and aimed for
  # system-wide updates that should affect all companies. In such cases all
  # "unused" company info records (i.e. ones that don't have bookings related)
  # are updated in place, and "used" ones are superseded (just like with
  # manual update via BO UI)
  #
  # @param params [Hash] attributes to be set for all companies (company infos)
  # @return [Integer] total amount of company_infos being updated
  #
  # Examples:
  #
  # UpdateCompanyInfos.new(params: {international_booking_fee: 25.0}).execute
  class UpdateCompanyInfos < ApplicationService
    include ApplicationService::ModelMethods

    attributes :params

    private def execute!
      transaction do
        result { unused_company_infos_dataset.update(params) }

        used_company_infos_dataset.paged_each do |info|
          supersede_company_info(info)

          break unless success?

          @result += 1
        end
      end
    end

    private def company_infos_dataset
      CompanyInfo.where(active: true)
    end

    private def unused_company_infos_dataset
      company_infos_dataset
        .where{ ~DB[:bookings].where(company_info_id: :company_infos[:id]).select(1).exists }
    end

    private def used_company_infos_dataset
      company_infos_dataset
        .where{ DB[:bookings].where(company_info_id: :company_infos[:id]).select(1).exists }
    end

    private def supersede_company_info(company_info)
      assert { update_model(company_info, active: false) }
      superseded = CompanyInfo.new(company_info.values.except(:id, :active, :created_at, :updated_at))
      assert { create_model(superseded, params) }
    end
  end
end
