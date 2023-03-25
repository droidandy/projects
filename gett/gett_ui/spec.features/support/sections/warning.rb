module Sections
  class Warning < SitePrism::Section
    element :message, '.ant-alert-message'
    element :description, '.ant-alert-description'
  end
end
