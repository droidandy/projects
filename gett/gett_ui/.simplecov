require "colorize"

SimpleCov.start do
  add_filter "/config/"
  add_filter "/spec/"
  add_filter "/vendor/"

  add_group "Controllers", "app/controllers"
  add_group "Models", "app/models"
  add_group "Services", "app/services"
  add_group "Mailers", "app/mailers"
  add_group "Policies", "app/policies"
  add_group "Workers", "app/workers"
  add_group "Uploaders", "app/uploaders"
  add_group "Libs", "lib"

  # Fail the build when coverage is weak:
  at_exit do
    if ParallelTests.last_process?
      SimpleCov.result.format!
      threshold, actual = 95, SimpleCov.result.covered_percent
      if actual < threshold then # FAIL
        msg = "\nLow coverage: "
        msg << "#{actual}%".colorize(:red)
        msg << " is " << "under".colorize(:red) << " the threshold: "
        msg << "#{threshold}%.".colorize(:green)
        msg << "\n"
        $stderr.puts msg
        exit 1
      else # PASS
        # Precision: three decimal places:
        actual_trunc = (actual * 1000).floor / 1000.0
        msg = "\nCoverage: "
        msg << "#{actual}%".colorize(:green)
        if actual_trunc > threshold
          msg << " is " << "over".colorize(:green) << " the threshold: "
          msg << "#{threshold}%. ".colorize(color: :yellow, mode: :bold)
          msg << "Please update the threshold to: "
          msg << "#{actual_trunc}% ".colorize(color: :green, mode: :bold)
          msg << "in ./.simplecov."
        else
          msg << " is " << "at".colorize(:green) << " the threshold: "
          msg << "#{threshold}%.".colorize(:green)
        end
        msg << "\n"
        $stdout.puts msg
      end
    end
  end
end
