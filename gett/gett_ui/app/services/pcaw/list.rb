module Pcaw
  class List < ApplicationService
    attributes :string

    REQUESTS_LIMIT = 5

    def initialize(**attrs)
      super
      @requests_count = 0
    end

    def execute!
      {
        list: get_list(string),
        status: 'success'
      }
    end

    private def get_list(string, last_id = nil)
      service = Pcaw::FetchList.new(string: string, last_id: last_id).execute
      @requests_count += 1
      list = service.result ? filter_list(service.result[:list], last_id) : []

      addresses(list) + groups(list).flat_map do |i|
        (@requests_count < REQUESTS_LIMIT) ? get_list(i[:text], i[:id]) : []
      end
    end

    private def addresses(list)
      list.select{ |i| i[:type] == 'Address' }
    end

    private def groups(list)
      list.select{ |i| i[:type] != 'Address' && i[:type] != 'CompanyName' }
    end

    private def filter_list(list, last_id)
      list.select{ |res| res[:id] != last_id }
    end
  end
end
