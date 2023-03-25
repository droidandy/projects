module System
  module SyncDrivers
    class Metrics < ApplicationService
      BATCH_SIZE = 10
      ATTRIBUTES = %i[
        rating
        today_acceptance
        week_acceptance
        month_acceptance
        total_acceptance
      ].freeze

      def execute!
        User.where.not(gett_id: nil).find_in_batches(batch_size: BATCH_SIZE).each do |current_users|
          process_users!(current_users)
        end

        success!
      end

      private def process_users!(users)
        compose(
          Drivers::Fleet::List.new(
            current_user,
            driver_ids: users.map(&:gett_id),
            fields: %i[statistics computed_rating]
          ),
          :drivers,
          pass_errors: false
        )
        return unless @drivers

        @drivers.each do |driver|
          user = User.find_by(gett_id: driver[:id])
          next unless user
          user.metrics.create(driver.slice(*ATTRIBUTES))
        end
      end
    end
  end
end
