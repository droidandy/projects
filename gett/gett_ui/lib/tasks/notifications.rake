namespace :notifications do
  desc 'Notify user about successful deployment'
  task deploy: :environment do
    notification = DeploymentNotification.current_text
    notification.gsub!('{deployment_time}', Time.current.in_time_zone(Settings.time_zone).strftime('%d/%m/%Y %H:%M'))
    message =
      Message.create(
        title: 'Last Deploy',
        body: notification,
        message_type: Message::MessageType::DEPLOYMENT
      )
    MessageNotificationJob.set(wait: 6.seconds).perform_later(message)
  end
end
