module Member::BBC
  extend ActiveSupport::Concern

  module PdType
    FREELANCER = 'freelancer'.freeze
    STAFF = 'staff'.freeze

    ALL_TYPES = [FREELANCER, STAFF].freeze
  end

  module PdStatus
    FULL_PD = 'full_pd'.freeze
    THIN_PD = 'thin_pd'.freeze
    TEMP_PD = 'temp_pd'.freeze
    FREELANCER = 'freelancer'.freeze
  end

  TEMP_PD_EXPIRATION_PERIOD = 29.days.freeze
  STAFF_PD_EXPIRATION_PERIOD = 1.year.freeze

  included do
    plugin :custom_attributes,
      attributes: [
        :pd_type, :wh_travel,
        :exemption_p11d, :exemption_ww_charges, :exemption_wh_hw_charges,
        :hw_exemption_time_from, :hw_exemption_time_to,
        :wh_exemption_time_from, :wh_exemption_time_to,
        :excess_distance, :allowed_excess_mileage,
        pd_accepted_at: :to_datetime.to_proc,
        pd_expires_at: :to_date.to_proc
      ]
  end

  def validate
    super
    return unless company&.bbc? && passenger?

    validates_includes(PdType::ALL_TYPES, :pd_type)

    if wh_travel?
      validates_presence(%i(
        hw_exemption_time_from hw_exemption_time_to
        wh_exemption_time_from wh_exemption_time_to
      ))
    end
  end

  def bbc_pd_status
    return PdStatus::FULL_PD if bbc_full?
    return PdStatus::THIN_PD if bbc_thin?
    return PdStatus::TEMP_PD if bbc_temp?
    return PdStatus::FREELANCER if bbc_freelancer?
  end

  def bbc_freelancer?
    pd_type == PdType::FREELANCER
  end

  def bbc_staff?
    pd_type == PdType::STAFF
  end

  def bbc_temp?
    bbc_staff? && !pd_accepted?
  end

  def bbc_thin?
    bbc_staff? && pd_accepted? && !wh_travel
  end

  def bbc_full?
    bbc_staff? && pd_accepted? && wh_travel
  end

  def pd_eligible?
    pd_accepted? && !pd_expired?
  end

  def pd_accepted?
    return unless bbc_staff?

    pd_accepted_at.present?
  end

  def pd_expired?
    !!pd_expires_at&.past?
  end

  def mileage_limit
    allowed_excess_mileage.to_f + company.travel_policy_mileage_limit.to_f
  end
end
