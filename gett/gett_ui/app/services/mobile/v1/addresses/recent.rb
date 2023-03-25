using Sequel::CoreRefinements

module Mobile::V1
  module Addresses
    class Recent < ApplicationService
      include ApplicationService::Context

      delegate :company, :member, to: :context

      def execute!
        { list: address_items.map{ |item| address_as_json(item) } }
      end

      private def address_items
        company.bookings_dataset
          .where((:bookings[:booker_id] =~ member.id) | (:bookings[:passenger_id] =~ member.id))
          .association_join(booking_addresses: :address)
          .select(:address.*, :bookings[:created_at].as(:timestamp))
          .distinct(:address[:id])
          .from_self
          .order(:timestamp.desc)
          .limit(10)
          .all
      end

      private def address_as_json(address)
        address.as_json(only: [
          :id,
          :line,
          :city,
          :region,
          :postal_code,
          :country_code,
          :timezone
        ]).tap do |json|
          json['lat'] = address[:lat].to_f
          json['lng'] = address[:lng].to_f
        end
      end
    end
  end
end
