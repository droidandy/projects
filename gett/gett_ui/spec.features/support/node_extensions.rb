module NodeExtensions
  include WaitUntilTrueHelper

  def disabled?
    if self[:role] == 'combobox'
      find(:xpath, './parent::div[contains(@class, "ant-select")]')[:class].include?('disabled')
    elsif self[:role] == 'menuitem'
      self[:'aria-disabled'] == 'true'
    elsif tag_name == 'label' || tag_name == 'span'
      self[:class].include? 'disabled' # ant-switcher
    else
      super
    end
  end

  # Hack to trigger React.Dom onChange event
  def clear
    set ' '
    # PhoneNumber inputs have country dial code pre-populated on focus. To have
    # it fully cleared, need more than one "backspace" hit
    wait_until_true do
      native.send_keys :backspace
      value.empty?
    end
  end
end

Capybara::Node::Element.prepend(NodeExtensions)
