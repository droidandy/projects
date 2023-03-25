module Sections
  module App::Settings
    class NewPayment < SitePrism::Section
      element :total_due, :text_node, 'totalDue'
    end
  end
end
