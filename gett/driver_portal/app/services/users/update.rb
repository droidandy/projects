module Users
  class Update < ApplicationService
    attr_reader :updated_user

    schema do # rubocop:disable Metrics/BlockLength
      required(:user).filled
      optional(:role).filled(included_in?: Role::ALL)
      # attributes
      optional(:email).maybe(:str?)
      optional(:password).maybe(:str?)
      optional(:password_confirmation).maybe(:str?)
      optional(:account_number).maybe(:str?)
      optional(:active).maybe(:bool?)
      optional(:address).maybe(:str?)
      optional(:badge_number).maybe(:str?)
      optional(:badge_type).maybe(:str?)
      optional(:blocked_at).maybe(:date_time?)
      optional(:city).maybe(:str?)
      optional(:gett_id).maybe(:int?)
      optional(:is_frozen).maybe(:bool?)
      optional(:license_number).maybe(:str?)
      optional(:name).maybe(:str?)
      optional(:phone).maybe(:str?)
      optional(:postcode).maybe(:str?)
      optional(:remote_avatar_url).maybe(:str?)
      optional(:sort_code).maybe(:str?)
      optional(:hobbies).maybe(:str?)
      optional(:talking_topics).maybe(:str?)
      optional(:driving_cab_since).maybe(:date?)
      optional(:disability_type).maybe(:str?)
      optional(:disability_description).maybe(:str?)
      optional(:birth_date).maybe(:date?)
      optional(:onboarding_step).maybe(:int?)
      optional(:onboarding_failed_at).maybe(:time?)
      optional(:how_did_you_hear_about).maybe(:str?)
      optional(:min_rides_number).maybe(:int?)
      optional(:other_rating).maybe(:float?)
      optional(:vehicle_reg_year).maybe(:int?)
      optional(:insurance_number).maybe(:str?)
      optional(:insurance_number_agreement).maybe(:bool?)
      optional(:documents_agreement).maybe(:bool?)
      optional(:appointment_scheduled).maybe(:bool?)
      optional(:documents_uploaded).maybe(:bool?)
      optional(:vehicle_colour).maybe(:str?)
    end

    def execute!
      PaperTrail.whodunnit(whodunnit) { user.update(attributes) } ? success! : fail!
    end

    on_fail { errors!(user.errors.to_h) if user }
    on_success :generate_avatar
    on_success :assign_role
    on_success { @updated_user = user }

    private def generate_avatar
      return if user.avatar_url || !Settings.generate_avatars
      AvatarGenerator.new(user).generate do |avatar|
        user.update(avatar: avatar)
      end
    end

    private def assign_role
      user.roles = [Role.find_or_create_by(name: role)] if role
    end

    private def attributes
      gather_attributes(
        :account_number,
        :address,
        :badge_number,
        :badge_type,
        :birth_date,
        :city,
        :email,
        :gett_id,
        :license_number,
        :name,
        :password_confirmation,
        :password,
        :phone,
        :postcode,
        :remote_avatar_url,
        :sort_code,
        :hobbies,
        :talking_topics,
        :driving_cab_since,
        :disability_type,
        :disability_description,
        :how_did_you_hear_about,
        :vehicle_colour,
        *onboarding_attributes
      ) do |hash|
        hash[:is_frozen] = is_frozen unless is_frozen.nil?
        hash[:blocked_at] = active ? nil : Time.current unless active.nil?
        hash[:onboarding_failed_at] = onboarding_failed_at if args.key?(:onboarding_failed_at)
      end
    end

    private def onboarding_attributes
      %i[
        onboarding_step
        min_rides_number
        other_rating
        vehicle_reg_year
        insurance_number
        insurance_number_agreement
        documents_agreement
        appointment_scheduled
        documents_uploaded
      ]
    end

    private def whodunnit
      return 'Anonymous' unless current_user
      "#{current_user.id} - #{current_user.name}"
    end
  end
end
