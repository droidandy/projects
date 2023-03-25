module OneTransport
  class Cancel < Base
    attributes :booking

    private def soap_method
      :job_cancel
    end

    def options
      {
        o_t_confirmation_number: booking.ot_confirmation_number,
        person_ID: booker[:person_ID],
        cancel_reason: 'Cancel'
      }
    end

    def error_message
      response.data[:header][:result][:message]
    end

    def cancellation_quote
      Bookings::DEFAULT_CANCELLATION_QUOTE
    end

    private def client_options
      {
        open_timeout: 120,
        read_timeout: 120
      }
    end
  end
end
