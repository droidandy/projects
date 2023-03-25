module Sections
  class GoogleMap < Base
    include DrawHelper
    element :attached_div, :xpath, '../../../../.'

    load_validation do
      [has_attached_div? && attached_div['class'] =~ /mapLoaded/, 'Map was not loaded']
    end

    def draw_poligon(points = [[100, 0], [100, 100], [0, 100]])
      super(self, points)
    end
  end
end
