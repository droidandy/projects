module Onboarding
  class Step1 < BaseStep
    RIDES = [0, 100, 200, 300, 400, 500].freeze

    schema do
      required(:min_rides_number).filled(included_in?: RIDES)
      required(:other_rating, Dry::Types['coercible.float']).filled
      required(:vehicle_reg_year).filled(:int?)
    end

    def execute!
      if current_user.onboarding_step != step
        return fail!(errors: { onboarding_step: ['invalid'] })
      end
      super
    end

    private def attributes
      gather_attributes(:min_rides_number, :other_rating, :vehicle_reg_year)
        .merge(onboarding_attributes)
    end

    private def step
      1
    end

    private def onboarding_attributes
      if not_enough_rides? || rating_too_low? || vehicle_too_old?
        { onboarding_failed_at: Time.current }
      else
        { onboarding_step: step + 1, onboarding_failed_at: nil }
      end
    end

    private def not_enough_rides?
      min_rides_number < Settings.onboarding.min_rides_number
    end

    private def rating_too_low?
      other_rating < Settings.onboarding.min_rating
    end

    private def vehicle_too_old?
      vehicle_reg_year < (Time.current.year - Settings.onboarding.max_vehicle_age)
    end
  end
end
