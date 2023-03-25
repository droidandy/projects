require 'session'
require 'compliance_queue'

module Users
  class Show < ApplicationPresenter
    attr_reader :user

    def initialize(user)
      @user = user
    end

    COLUMNS_TO_SHOW = %i[
      id
      created_at
      updated_at
      account_number
      address
      appointment_scheduled
      approval_status
      avatar_filename
      badge_number
      badge_type
      bank_account_number
      bank_sort_code
      birth_date
      city
      disability_description
      disability_type
      documents_agreement
      documents_uploaded
      driving_cab_since
      email
      first_name
      gett_id
      hobbies
      how_did_you_hear_about
      insurance_number
      insurance_number_agreement
      is_frozen
      last_name
      license_number
      month_acceptance
      onboarding_failed_at
      onboarding_step
      phone
      postcode
      rating
      min_rides_number
      sort_code
      talking_topics
      today_acceptance
      total_acceptance
      vehicle_colour
      vehicle_reg_year
      week_acceptance
    ].freeze

    def as_json(with_permissions: false, with_vehicles: false, with_driver: false)
      convert_to_json(user, only: COLUMNS_TO_SHOW) do |json|
        json[:active] = user.active?
        json[:invite] = presenter_for(@user.last_invite).as_json
        json[:last_activity_at] = Session.last_activity(@user).try(:iso8601)
        json[:roles] = @user.roles.map(&:name)
        json[:avatar_url] = @user.avatar.full_url
        json[:permissions] = @user.permissions.pluck(:slug).uniq if with_permissions

        if with_driver
          json[:driver_to_approve_id] = user.driver_to_approve&.id
        end

        if user.driver?
          json[:license] = @user.account_number
          json[:other_rating] = @user.other_rating&.to_f
          json[:onboarding_completed] = @user.onboarding_completed?
          json[:documents_expiration_warning] = documents_expiration_warning
          json[:pending_documents_number] = pending_documents_number
          json[:compliance_queue_position] = compliance_queue_position
          if with_vehicles
            json[:vehicles] = vehicles.map do |vehicle|
              ::Vehicles::Show.new(vehicle, user).as_json(with_documents: false)
            end
          end
        end

        json.merge!(Agents::Show.new(user).as_json) if user.onboarding_agent?
      end
    end

    private def documents_expiration_warning
      ::Documents::Search.new({ required: true, expiring: true }, current_user: user).exists?
    end

    private def vehicles
      ::Vehicles::Search.new({}, current_user: user).resolved_scope
    end

    private def pending_documents_number
      ::Documents::Search.new({ approval_status: 'pending' }, current_user: user).count
    end

    private def compliance_queue_position
      ComplianceQueue.new(user).position
    end

    def as_jwt
      convert_to_json(user, only: %i[id email]) do |json|
        json[:type] = User.class.name
        json[:uuid] = SecureRandom.uuid
        json[:created_at] = Time.zone.now
      end
    end
  end
end
