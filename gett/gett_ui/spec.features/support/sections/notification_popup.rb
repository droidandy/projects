module Sections
  class NotificationPopup < SitePrism::Section
    element :close_cross, '.ant-notification-notice-close'
    element :message, '.ant-notification-notice-message'
    element :description, '.ant-notification-notice-description'

    def close
      close_cross.click
    end
  end
end
