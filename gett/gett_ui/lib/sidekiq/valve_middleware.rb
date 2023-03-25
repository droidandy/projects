class Sidekiq::ValveMiddleware
  class_attribute :jobs_in_progress, instance_writer: false
  class_attribute :gc_start_count, :gc_jobs_count, instance_accessor: false
  self.jobs_in_progress = {}
  self.gc_jobs_count = 0

  attr_reader :controlled_jobs

  def self.count_job_for_gc
    return if gc_start_count.blank?

    self.gc_jobs_count += 1

    if gc_jobs_count >= gc_start_count
      GC.start
      self.gc_jobs_count = 0
    end
  end

  def initialize(jobs:, gc_start_count: nil)
    @controlled_jobs = jobs
    self.class.gc_start_count = gc_start_count
  end

  def call(_worker, job, *)
    return yield unless controlled?(job)

    with_job(job){ yield } unless in_progress?(job)
  end

  private def controlled?(job)
    controlled_jobs.include?(job['class'])
  end

  private def in_progress?(job)
    jobs_in_progress[job['class']]
  end

  private def with_job(job)
    jobs_in_progress[job['class']] = true
    yield
  ensure
    self.class.count_job_for_gc

    jobs_in_progress[job['class']] = false
  end
end
