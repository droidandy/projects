using Sequel::CoreRefinements

class Bookings::IndexPolicy < ServicePolicy
  allow_all!

  scope do |member|
    dataset = member.company.bookings_dataset
    assigned_passenger_ids = member.raw_passengers_dataset.select(:id)
    company_passenger_ids = member.company.raw_passengers_dataset.select(:id)

    # filter bookings based on payment_type:
    # executive & finance do not have access to bookings made with personal card UNLESS
    # allow_personal_card_usage is set to true OR they are the passenger.
    if member.executive? || member.finance?
      dataset =
        dataset.where do
          (:bookings[:payment_method] !~ 'personal_payment_card') |
          (:bookings[:passenger_id] =~ company_passenger_ids.where(allow_personal_card_usage: true)) |
          (:bookings[:passenger_id] =~ member.id)
        end
    end

    # filter bookings based on payment_type availability:
    # current booker has access to all related bookings if they have payment_method NOT 'personal_payment_card'
    # OR if related passenger has `allow_personal_card_usage` set to true.
    if member.booker? && !(member.executive? || member.finance?) && !member.company.bbc?
      dataset =
        dataset.where do
          (:bookings[:passenger_id] =~ member.id) |
          (:bookings[:payment_method] !~ 'personal_payment_card') |
          ((:bookings[:payment_method] =~ 'personal_payment_card') &
            (:bookings[:passenger_id] =~ assigned_passenger_ids.where(allow_personal_card_usage: true)))
        end
    end

    if member.executive? || member.finance?
      dataset
    elsif member.booker? && !member.company.bbc?
      # filter bookings based on passenger-booker relationship:
      # current booker should have access to all bookings where he/she is a passenger
      # OR he/she is a booker
      # OR bookings with passengers related to the current booker.
      dataset.where do
        (:bookings[:booker_id] =~ member.id) |
        (:bookings[:passenger_id] =~ member.id) |
        (:bookings[:passenger_id] =~ assigned_passenger_ids)
      end
    elsif member.booker? && member.company.bbc?
      # filter bookings based on passenger-booker relationship:
      # similar to the previous one without bookings with passengers that don't relate to any bookers
      dataset.where do
        (:bookings[:passenger_id] =~ member.id) |
        (:bookings[:passenger_id] =~ assigned_passenger_ids) |
        ((:bookings[:passenger_id] =~ nil) & (:bookings[:booker_id] =~ member.id))
      end
    else
      dataset.where(:bookings[:passenger_id] => member.id)
    end
  end
end
