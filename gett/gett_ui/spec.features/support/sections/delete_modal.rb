module Sections
  class DeleteModal < SitePrism::Section
    element :title, '.ant-confirm-title'
    element :cancel_button, :button, 'Cancel'
    element :close_button, :button, 'Close'
    element :ok_button, :button, 'OK'
  end
end
