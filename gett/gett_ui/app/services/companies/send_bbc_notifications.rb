class Companies::SendBbcNotifications < ApplicationService
  attributes :company

  def execute!
    send_pd_exprires_soon_notification
    send_pd_exprires_soon_email

    send_pd_exprired_today_notification_and_email
  end

  private def send_pd_exprires_soon_notification
    dates_to_notify = (1..10).map { |days| Date.current + days }

    members_to_notify = members_with_pd_expires_at(dates_to_notify)
    members_to_notify.paged_each do |member|
      Messages::CreatePersonal.new(
        recipient: member,
        message_body: I18n.t('bbc.passenger_notifications.pd_expire_soon')
      ).execute
    end
  end

  private def send_pd_exprires_soon_email
    dates_to_notify = [28, 14, 7, 1].map { |days| Date.current + days }

    members_to_notify = members_with_pd_expires_at(dates_to_notify)
    members_to_notify.paged_each do |member|
      BbcNotificationsMailer.pd_expires_soon(passenger: member).deliver_later
    end
  end

  private def send_pd_exprired_today_notification_and_email
    dates_to_notify = [Date.current]

    members_to_notify = members_with_pd_expires_at(dates_to_notify)
    members_to_notify.paged_each do |member|
      BbcNotificationsMailer.pd_expired(passenger: member).deliver_later
      Messages::CreatePersonal.new(
        recipient: member,
        message_body: I18n.t('bbc.passenger_notifications.pd_expired')
      ).execute
    end
  end

  private def members_with_pd_expires_at(dates)
    company.members_dataset.active.where(
      Sequel.pg_jsonb_op(:custom_attributes).get_text('pd_expires_at') =~ dates
    )
  end
end
