module Users
  class Register < ApplicationService
    VEHICLE_TITLE = 'Vehicle 1'.freeze

    schema do
      required(:email).filled(:str?)
      required(:first_name).filled(:str?)
      required(:last_name).filled(:str?)
      required(:phone).filled(:str?)
      required(:license_number).filled(:str?)
      optional(:how_did_you_hear_about).maybe(:str?)
    end

    def initialize(args)
      super(nil, args)
    end

    def execute!
      super do
        compose(::Users::Create.new(system_user, user_attributes), :user)
        return fail! if errors?
        compose(::Invites::Create.new(system_user, user_id: @user.id))
        return fail! if errors?
        compose(::Vehicles::Create.new(@user, vehicle_attributes), :vehicle)
      end
    end

    private def user_attributes
      {
        active: true,
        email: email,
        name: [first_name, last_name].join(' '),
        password: password,
        password_confirmation: password,
        phone: phone,
        license_number: license_number,
        how_did_you_hear_about: how_did_you_hear_about,
        role: 'apollo_driver',
        onboarding_step: 1
      }
    end

    private def vehicle_attributes
      {
        title: VEHICLE_TITLE
      }
    end

    private def password
      @password ||= SecureRandom.hex
    end
  end
end
