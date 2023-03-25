module Sections
  class Modal < Base
    element :title, '.ant-modal-title'
    element :body, '.ant-modal-body'
    element :close_button, :button, 'OK'
    element :cancel_button, :button, 'Cancel'
    element :save_button, :button, 'Save'
    element :submit_button, :button, 'Submit'
  end
end
