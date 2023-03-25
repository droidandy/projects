module Passengers
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :passenger, :params
    delegate :company, to: :context

    def initialize(passenger: nil, **)
      super
      @onboarding_was = passenger&.onboarding
    end

    def execute!
      transaction do
        drop_pd_acceptance_if_updated do
          result do
            update_model(passenger, passenger_params) do |p|
              p.validates_presence(:payroll) if should_validate_payroll?
              p.validates_presence(:cost_centre) if should_validate_cost_centre?
            end
          end
          assert { passenger.set_reset_password_token! } if onboarded?
          assign_home_address if home_address_submitted?
          assign_work_address if work_address_submitted?
          passenger.associations.except!(:home_address, :work_address) # to cleanup cached address assodications
          assert { update_custom_attributes(passenger, custom_attribute_params) } if custom_attribute_params.present?
        end

        update_pd_acceptance
      end

      send_invitation if success? && onboarded?
    end

    def home_address
      @home_address ||= passenger.home_passenger_address || passenger.build_passenger_address(type: 'home')
    end

    def work_address
      @work_address ||= passenger.work_passenger_address || passenger.build_passenger_address(type: 'work')
    end

    def errors
      consolidate_errors(
        @errors || {},
        passenger.errors,
        home_address: home_address.errors.values.flatten,
        work_address: work_address.errors.values.flatten
      ).transform_keys do |k|
        Member.custom_attribute_names.include?(k.to_sym) ? "custom_attributes.#{k}" : k
      end
    end

    private def assign_home_address
      # home address required only for FullPD users
      address_line = params.dig(:home_address, :line)
      pd_status = params.dig(:custom_attributes, :pd_status)
      if company.bbc? && pd_status == Member::BBC::PdStatus::FULL_PD && address_line.blank?
        set_errors(home_address: ['is not present'])
        return fail!
      end

      assert { assign_address(home_address, home_address_params, join_model: true) }
    end

    private def assign_work_address
      # work address required for FullPD and ThinPD users
      address_line = params.dig(:work_address, :line)
      pd_status = params.dig(:custom_attributes, :pd_status)

      full_or_thin_pd = pd_status.in?([Member::BBC::PdStatus::FULL_PD, Member::BBC::PdStatus::THIN_PD])

      if company.bbc? && full_or_thin_pd && address_line.blank?
        set_errors(work_address: ['is not present'])
        return fail!
      end

      assert { assign_address(work_address, work_address_params, join_model: true) }
    end

    private def onboarded?
      @onboarding_was.nil? && passenger&.onboarding
    end

    private def passenger_params
      params.slice(*policy.permitted_passenger_params).tap do |ps|
        role_id = policy.permitted_role_id(params[:role_type])
        ps[:member_role_id] = role_id if role_id.present?

        if context.import
          ps[:import] = true
          return ps
        end

        return ps unless policy.assign_self?

        ps[:booker_pks] =
          if params[:self_assigned].present?
            passenger.booker_pks + [context.member.id]
          else
            passenger.booker_pks - [context.member.id]
          end
      end
    end

    private def custom_attribute_params
      params[:custom_attributes]&.slice(*policy.permitted_custom_attribute_params)
    end

    private def home_address_params
      params[:home_address]
    end

    private def work_address_params
      params[:work_address]
    end

    private def home_address_submitted?
      params.key?(:home_address)
    end

    private def work_address_submitted?
      params.key?(:work_address)
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

    private def drop_pd_acceptance_if_updated
      return yield unless company.bbc?

      old_values = pd_specific_values

      yield

      if pd_specific_values != old_values
        assert do
          update_model(passenger,
            pd_accepted_at: nil,
            pd_expires_at: Date.current + Member::BBC::TEMP_PD_EXPIRATION_PERIOD
          )
        end
      end
    end

    private def update_pd_acceptance
      return unless policy.accept_pd?
      return if passenger.pd_eligible?
      return unless params[:custom_attributes]&.fetch(:pd_accepted, false)

      assert do
        update_model(passenger,
          pd_accepted_at: Time.current,
          pd_expires_at: Date.current + Member::BBC::STAFF_PD_EXPIRATION_PERIOD
        )
      end
    end

    private def pd_specific_values
      [
        passenger.role&.id,
        passenger.first_name,
        passenger.last_name,
        passenger.pd_type,
        passenger.phone,
        passenger.email,
        passenger.work_address&.line,
        passenger.home_address&.line,
        passenger.wh_travel
      ]
    end
  end
end
