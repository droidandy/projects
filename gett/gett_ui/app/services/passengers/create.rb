module Passengers
  class Create < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    DEFAULT_DEFAULT_VEHICLE = 'BlackTaxi'.freeze

    attributes :params
    delegate :company, to: :context

    def execute!
      transaction do
        result do
          save_model(passenger, passenger_params) do |p|
            p.validates_presence(:payroll) if should_validate_payroll?
            p.validates_presence(:cost_centre) if should_validate_cost_centre?
            p.default_vehicle ||= DEFAULT_DEFAULT_VEHICLE
          end
        end

        assert { passenger.set_reset_password_token! } if onboarding?

        if passenger.persisted?
          assert { assign_address(home_address, home_address_params) } if home_address_submitted?
          assert { assign_address(work_address, work_address_params) } if work_address_submitted?
        end
      end

      update_pd_acceptance if company.bbc?

      send_invitation if success? && onboarding?
    end

    def passenger
      @passenger ||= Member.new(company: company, role: Role[params[:role_type] || :passenger])
    end

    def home_address
      @home_address ||= PassengerAddress.new(passenger_id: passenger.id, type: 'home')
    end

    def work_address
      @work_address ||= PassengerAddress.new(passenger_id: passenger.id, type: 'work')
    end

    def errors
      consolidate_errors(passenger.errors,
        home_address: home_address.errors.values.flatten,
        work_address: work_address.errors.values.flatten
      ).transform_keys do |k|
        Member.custom_attribute_names.include?(k.to_sym) ? "custom_attributes.#{k}" : k
      end
    end

    private def update_pd_acceptance
      return unless passenger&.bbc_staff?

      assert do
        update_model(passenger,
          pd_expires_at: Date.current + Member::BBC::TEMP_PD_EXPIRATION_PERIOD
        )
      end
    end

    private def onboarding?
      passenger&.onboarding
    end

    private def passenger_params
      params
        .except(:home_address, :work_address, :role_type, :personal_payment_card, :business_payment_card, :self_assigned, :allow_personal_card_usage)
        .tap do |prms|
          prms[:booker_pks] = [context.member.id] if context.member.booker?
          prms[:import] = context.import
        end
    end

    private def home_address_params
      params[:home_address]
    end

    private def work_address_params
      params[:work_address]
    end

    private def home_address_submitted?
      home_address_params.present? && home_address_params[:line].present?
    end

    private def work_address_submitted?
      work_address_params.present? && work_address_params[:line].present?
    end

    private def send_invitation
      MembersMailer.invitation(passenger.id).deliver_later
    end

    private def should_validate_payroll?
      company.payroll_required? && policy.change_payroll?
    end

    private def should_validate_cost_centre?
      company.cost_centre_required? && policy.change_cost_centre?
    end
  end
end
