require 'avatar_generator'

module Users
  class Create < ApplicationService
    attr_reader :user

    schema do
      optional(:role).filled(included_in?: Role::ALL)
      # attributes
      required(:email).filled(:str?)
      optional(:password).filled(:str?)
      optional(:password_confirmation).filled(:str?)
      optional(:account_number).maybe(:str?)
      optional(:active).maybe(:bool?)
      optional(:address).maybe(:str?)
      optional(:badge_number).maybe(:str?)
      optional(:badge_type).maybe(:str?)
      optional(:city).maybe(:str?)
      optional(:gett_id).maybe(:int?)
      optional(:is_frozen).maybe(:bool?)
      optional(:license_number).maybe(:str?)
      optional(:name).maybe(:str?)
      optional(:phone).maybe(:str?)
      optional(:postcode).maybe(:str?)
      optional(:remote_avatar_url).maybe(:str?)
      optional(:sort_code).maybe(:str?)
      optional(:how_did_you_hear_about).maybe(:str?)
      optional(:onboarding_step).maybe(:int?)
    end

    def execute!
      @user = User.new(attributes)
      @user.save ? success! : fail!
    end

    on_fail { errors!(user.errors.to_h) if user }
    on_success :generate_avatar
    on_success :assign_role
    on_success :create_review

    private def generate_avatar
      return if user.avatar_url || !Settings.generate_avatars
      AvatarGenerator.new(user).generate do |avatar|
        user.update(avatar: avatar)
      end
    end

    private def assign_role
      user.add_role(role) if role
    end

    private def create_review
      user.reviews.create attempt_number: 1 if role.to_s == 'apollo_driver'
    end

    private def attributes
      hash = {
        email: email,
        password: password,
        password_confirmation: password_confirmation,
        account_number: account_number,
        address: address,
        badge_number: badge_number,
        badge_type: badge_type,
        city: city,
        gett_id: gett_id,
        is_frozen: is_frozen || false,
        license_number: license_number,
        name: name,
        phone: phone,
        postcode: postcode,
        remote_avatar_url: remote_avatar_url,
        sort_code: sort_code,
        onboarding_step: onboarding_step,
        how_did_you_hear_about: how_did_you_hear_about
      }
      hash.reject! { |_, v| v.nil? }
      hash[:blocked_at] = active ? nil : Time.current unless active.nil?
      hash
    end
  end
end
