class External::Bookings::Create < Bookings::Create
  include External::Bookings::AddressPreprocessor
end
