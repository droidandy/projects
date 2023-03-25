module Mobile::V1
  class PassengersController < ApplicationController
    around_action :skip_address_sanitize

    def edit
      render json: Passengers::Form.new(passenger: passenger).execute.result
    end

    def update
      service = ::Passengers::Update.new(passenger: passenger, params: passenger_params)

      if service.execute.success?
        head :ok
      else
        render json: {errors: service.errors}, status: :unprocessable_entity
      end
    end

    private def passenger
      @passenger ||= current_company.passengers_dataset.with_pk!(params[:id])
    end

    private def passenger_params
      params.require(:passenger).permit(
        :first_name, :last_name, :email, :phone, :mobile, :work,
        :reference, :department, :active, :avatar, :onboarding,
        :work_role_id, :department_id, :self_assigned, :role_type,
        :notify_with_sms, :notify_with_email, :notify_with_push, :wheelchair_user,
        :payroll, :cost_centre, :division, :notify_with_calendar_event,
        :vip, :allow_personal_card_usage, :default_vehicle, :default_phone_type,
        booker_pks: [],
        passenger_pks: [],
        work_address: [
          :line, :lat, :lng, :postal_code, :country_code, :city, :region
        ],
        home_address: [
          :line, :lat, :lng, :postal_code, :country_code, :city, :region
        ],
        custom_attributes: [
          :pd_type, :pd_accepted, :wh_travel,
          :exemption_p_11_d, :exemption_ww_charges, :exemption_wh_hw_charges,
          :hw_exemption_time_from, :hw_exemption_time_to,
          :wh_exemption_time_from, :wh_exemption_time_to
        ]
      )
    end
  end
end
