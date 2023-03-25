module Admin::Bookings
  class Create < Shared::Bookings::Create
    include ApplicationService::Context

    private def booker
      user
    end
  end
end
