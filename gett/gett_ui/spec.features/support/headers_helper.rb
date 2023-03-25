module HeadersHelper
  MOCK_HEADER = 'X-Mock-Data'.freeze

  # rubocop:disable Naming/AccessorMethodName
  def set_mock_header(value)
    current_value = RequestStore.store[:x_mock_data] || {}
    new_value = current_value.deep_merge(value)
    set_new_header_value(new_value)
  end

  private def set_new_header_value(new_value)
    RequestStore.store[:x_mock_data] = new_value
    bm&.set_header MOCK_HEADER, new_value.to_json
  end
  # rubocop:enable Naming/AccessorMethodName

  def clear_all_headers
    RequestStore.store.delete(:x_mock_data)
    bm&.clear_header(MOCK_HEADER)
  end

  def bm
    BrowserMobHelper.instance
  end

  # rubocop:disable Naming/AccessorMethodName
  def set_address_headers(address)
    set_mock_header google_maps: { autocomplete: {input: address}, details: {address: address}}
  end
  # rubocop:enable Naming/AccessorMethodName

  def with_headers(headers = nil)
    original_headers = RequestStore.store[:x_mock_data]
    set_mock_header headers if headers
    yield
  ensure
    clear_all_headers
    set_mock_header original_headers if original_headers
  end
end
