Capybara.add_selector(:combobox) do
  xpath { |label| XPath.descendant(:div)[XPath.attr(:'data-name') == label].descendant(:div)[XPath.attr(:role) == 'combobox'] }
end

Capybara.add_selector(:phone) do
  xpath { |label| XPath.descendant(:div)[XPath.attr(:'data-name') == label].descendant_or_self(:div)[XPath.attr(:role) == 'combobox'] }
end

Capybara.add_selector(:combobox_option) do
  xpath { |label| XPath.anywhere(:li)[XPath.starts_with(label).and XPath.attr(:role) == 'option'] }
end

Capybara.add_selector(:menu_item) do
  xpath { |label| XPath.anywhere(:li)[XPath.starts_with(label).and XPath.attr(:role) == 'menuitem'] }
end

Capybara.add_selector(:button) do
  xpath(:value, :title) do |locator, options = {}|
    input_btn_xpath = XPath.descendant(:input)[XPath.attr(:type).one_of('submit', 'reset', 'image', 'button')]
    btn_xpath = XPath.descendant(:button)
    image_btn_xpath = XPath.descendant(:input)[XPath.attr(:type).equals('image')]

    unless locator.nil?
      locator = locator.to_s
      locator_matches = XPath.attr(:id).equals(locator)
        .or XPath.attr(:value).is(locator)
        .or XPath.attr(:title).is(locator)
        .or XPath.attr(:'data-name').is(locator)
      locator_matches = locator_matches.or XPath.attr(:'aria-label').is(locator) if options[:enable_aria_label]

      input_btn_xpath = input_btn_xpath[locator_matches]

      btn_xpath = btn_xpath[locator_matches.or XPath.string.n.is(locator).or XPath.descendant(:img)[XPath.attr(:alt).is(locator)]]

      alt_matches = XPath.attr(:alt).is(locator)
      alt_matches = alt_matches.or XPath.attr(:'aria-label').is(locator) if options[:enable_aria_label]
      image_btn_xpath = image_btn_xpath[alt_matches]
    end

    res_xpath = input_btn_xpath.union(btn_xpath).union(image_btn_xpath)

    res_xpath = expression_filters.keys.reduce(res_xpath) { |memo, ef| memo[find_by_attr(ef, options[ef])] }

    res_xpath
  end

  filter(:disabled, :boolean, default: false, skip_if: :all) { |node, value| !(value ^ node.disabled?) }

  describe do |options|
    desc = ""
    desc << " that is disabled" if options[:disabled] == true
    desc << describe_all_expression_filters(options)
    desc
  end
end

Capybara.add_selector(:ant_radio_button) do
  xpath { |locator| XPath.descendant(:label)[XPath.descendant(:input)[XPath.attr(:'data-name').equals(locator).or XPath.attr(:name).equals(locator)]] }
  visible :all
end

Capybara.add_selector(:date_picker) do
  xpath { |locator| XPath.descendant(:div)[XPath.attr(:'data-name') == locator].descendant(:input)[XPath.attr(:class).is('ant-calendar-picker')] }
end

Capybara.add_selector(:text_node) do
  xpath { |locator| XPath.descendant(:div, :span, :pre)[XPath.attr(:'data-name') == locator] }
end

Capybara.add_selector(:switcher) do
  xpath { |locator| XPath.descendant(:button)[XPath.attr(:'data-name') == locator][XPath.attr(:class).is('ant-switch')] }
end

Capybara.add_selector(:checkbox) do
  xpath { |locator| XPath.descendant(:input)[XPath.attr(:type).equals('checkbox')][XPath.attr(:'data-name').is(locator).or XPath.attr(:class).is(locator)] }
  visible :all
end

module LocateField
  # Add capability to search fields using 'data-name' attribute
  private def locate_field(xpath, locator, options = {})
    locate_xpath = xpath # need to save original xpath for the label wrap
    if locator
      locator = locator.to_s
      attr_matchers = XPath.attr(:id).equals(locator).or(
        XPath.attr(:name).equals(locator)
      ).or(
        XPath.attr(:placeholder).equals(locator)
      ).or(
        XPath.attr(:id).equals(XPath.anywhere(:label)[XPath.string.n.is(locator)].attr(:for))
      )

      attr_matchers = attr_matchers.or XPath.attr(:'aria-label').is(locator) if options[:enable_aria_label]
      attr_matchers = attr_matchers.or XPath.attr(:'data-name').is(locator)

      locate_xpath = locate_xpath[attr_matchers]
      locate_xpath = locate_xpath.union(XPath.descendant(:label)[XPath.string.n.is(locator)].descendant(xpath))
    end
    locate_xpath
  end
end

Capybara::Selector.prepend(LocateField)
