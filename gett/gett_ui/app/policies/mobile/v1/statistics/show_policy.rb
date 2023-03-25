using Sequel::CoreRefinements

module Mobile::V1
  module Statistics
    class ShowPolicy < ServicePolicy
      allow_all!

      def show_all_graphs?
        member.executive? || member.finance?
      end

      scope do |member|
        if member.executive? || member.finance?
          company_ids = member.company.linked_company_pks.push(member.company.id)

          Booking.dataset
            .association_join(company_info: :company)
            .where(:company[:id] => company_ids)
        elsif member.booker?
          member.company.bookings_dataset.where{ (:bookings[:passenger_id] =~ member.id) | (:bookings[:booker_id] =~ member.id) }
        else
          member.company.bookings_dataset.where{ :bookings[:passenger_id] =~ member.id }
        end
      end
    end
  end
end
