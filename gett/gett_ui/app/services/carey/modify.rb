module Carey
  class Modify < Carey::Create
    attributes :booking

    def soap_method
      :modify_reservation
    end

    private def header_attributes
      {
        Version: last_version,
        SequenceNmbr: sequence_number
      }
    end

    def options
      structure = {
        POS: pos_structure,
        Reservation: {
          ReferenceID: {
            :@ID => booking.service_id
          },
          Service: {
            ServiceLevel: service_level_structure,
            VehicleType: {
              :@Code => booking.quote_id
            },
            Locations: stops_structure
          },
          Passenger: passenger_structure,
          RateQualifier: rate_qualifier
        }
      }
      structure[:TPA_Extensions] = tpa_extensions if tpa_extensions.present?
      structure
    end

    private def tpa_extensions
      reservation_data = find_reservation_service.execute.normalized_response
      {
        Notice: reservation_data[:notice],
        MeetingInstruction: reservation_data[:meeting_instruction],
        PickUpSpecialInstructions: reservation_data[:pick_up_special_instructions]
      }.compact
    end
  end
end
