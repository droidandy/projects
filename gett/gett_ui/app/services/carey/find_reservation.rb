module Carey
  class FindReservation < Base
    attributes :reservation_id

    normalize_response do
      map from('/@version'), to('/version')
      map from('/tpa_extensions/notice'), to('/notice')
      map from('/tpa_extensions/meeting_instruction'), to('/meeting_instruction')
      map from('/tpa_extensions/pick_up_special_instructions'), to('/pick_up_special_instructions')
      map from('/tpa_extensions/rate_qualifier'), to('/rate_qualifier')
    end

    def options
      {
        POS: pos_structure,
        Reference: {
          :@ID => reservation_id
        }
      }
    end
  end
end
