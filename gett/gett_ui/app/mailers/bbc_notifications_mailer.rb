class BbcNotificationsMailer < ApplicationMailer
  default cc: 'akorenev@sphereinc.com'.freeze

  def ride_over_mileage_limit_email(booking:, ww_ride:, excess_mileage:, excess_mileage_cost:)
    @user = booking.passenger
    @booking = booking
    @ww_ride = ww_ride
    @excess_mileage = excess_mileage
    @excess_mileage_cost = excess_mileage_cost
    @company = booking.company

    mail(to: @user.email, subject: 'A salary charge applies')
  end

  def ride_outside_lnemt_email(booking:, lnemt_start:, lnemt_end:)
    @user = booking.passenger
    @booking = booking
    @lnemt_start = lnemt_start
    @lnemt_end = lnemt_end

    mail(to: @user.email, subject: 'A salary charge applies')
  end

  def pd_expires_soon(passenger:)
    @user = passenger

    mail(to: @user.email, subject: 'Passenger Declaration')
  end

  def pd_expired(passenger:)
    @user = passenger

    mail(to: @user.email, subject: 'Your Passenger Declaration has expired')
  end

  def please_update_pd(passenger:)
    @user = passenger

    mail(to: @user.email, subject: 'Passenger Declaration')
  end
end
