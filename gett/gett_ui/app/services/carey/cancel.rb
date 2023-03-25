module Carey
  class Cancel < Base
    attributes :booking

    def soap_method
      :cancel_reservation
    end

    def error_message
      response.data[:errors][:error]
    end

    private def header_attributes
      {
        Version: last_version,
        SequenceNmbr: sequence_number
      }
    end

    def options
      {
        POS: pos_structure,
        Reservation: {
          UniqueID: {
            :@ID => booking.service_id
          }
        }
      }
    end
  end
end
