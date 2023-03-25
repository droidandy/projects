class DriverReport < ApplicationRecord
  enum period: {
    current: 0,
    previous: 1
  }
end
