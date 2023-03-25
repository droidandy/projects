class BM
  @measurements = Hash.new { |hash, key| hash[key] = 0 }
  @details = {
    aggregated: Hash.new { |hash, key| hash[key] = 0 },
    details: []
  }
  @mutex = Mutex.new

  class << self
    include VerboseHelper

    attr_accessor :measurements
    attr_reader :details
    def sleep(num)
      Kernel.sleep num
      @mutex.synchronize do
        @measurements[:sleep] += num
      end
    end

    def [](key)
      @measurements[key]
    end

    def wait_time
      @wait
    end

    def setup_db
      @setup
    end

    def clear_db
      @clear
    end

    def reset!
      @measurements.clear
    end

    def measure(title = :wait)
      time = Time.current
      yield
      diff = Time.current - time
      @mutex.synchronize do
        @measurements[title] += diff
      end
      diff
    end

    def record_details(wait_time, source)
      top = source.first.gsub!(/.*?(?=spec\.features)/im, '')
      @details[:aggregated][top] += wait_time
      @details[:details] << [
        wait_time,
        source
          .select { |l| l.match?(/spec\.features/) }
          .reject { |l| l.match?(%r{(?:features_helper|support/bm)\.rb}) }
      ]
    end

    def count_setup_db
      measure(:count_setup_db) do
        yield
      end
    end

    def count_clear_db
      measure(:count_clear_db) do
        yield
      end
    end
  end
end
