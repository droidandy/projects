module DrawHelper
  def draw_poligon(element, points = [[100, 0], [100, 100], [0, 100]])
    element = element.root_element unless element.is_a?(Capybara::Node::Element)
    dimentions = element.native.size
    # move to the left top corner of element
    action = Capybara.page.driver.browser.action
      .move_to(element.native).move_by(dimentions.width / 2 + 1, 0).click
      .move_by(-dimentions.width, 0)

    current_position = [0, 0]
    (points + [points[0]]).each do |x, y|
      shift_x = x - current_position[0]
      shift_y = y - current_position[1]
      action = action.move_by(shift_x, shift_y).click.click
      current_position = [x, y]
    end
    action.perform
  end
end
