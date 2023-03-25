module VerboseHelper
  def verbose(msg)
    puts "#{Time.current.strftime('%m/%d/%Y %H:%M')}: #{msg}" if ENV['verbose']
  end
end
