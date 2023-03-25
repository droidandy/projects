module Sections
  class CancelModal < Base
    element :title, '.ant-confirm-title'
    element :cancel_button, :button, 'Cancel'
    element :yes_button, :button, 'Yes'
    element :close_button, :button, 'Close'
  end
end
