module Sections
  module Admin::Companies
    class CustomerCarePassword < SitePrism::Section
      element :title, '.ant-modal-title'
      section :password, Sections::Input, :field, 'password'
      element :cancel_button, :button, 'Cancel'
      element :ok_button, :button, 'Submit'
    end
  end
end
