using Sequel::CoreRefinements

class Error < Sequel::Model
  plugin :timestamps, update_on_create: true

  def self.save(exception, **attrs)
    fingerprint = Digest::MD5.hexdigest(
      Time.now.utc.to_date.to_s +
      attrs[:subject_gid].to_s +
      exception.class.name +
      # Sequel::PoolTimeout exceptions have elapsed time in their messages, like '5.170584032'
      # which result in new fingerprint every time if message is included
      (exception.is_a?(Sequel::PoolTimeout) ? '' : exception.message) +
      exception.backtrace.join
    )

    if (existing = find(fingerprint: fingerprint)).present?
      existing.update(raised_count: existing.raised_count + 1)
    else
      create(attrs.reverse_merge(
        fingerprint: fingerprint,
        error_class: exception.class.name,
        message: exception.message,
        backtrace: exception.backtrace.pg_array
      ))
    end
  end
end

# Table: errors
# Columns:
#  id           | integer                     | PRIMARY KEY DEFAULT nextval('errors_id_seq'::regclass)
#  subject_gid  | text                        |
#  fingerprint  | text                        | NOT NULL
#  error_class  | text                        | NOT NULL
#  message      | text                        | NOT NULL
#  backtrace    | text[]                      | NOT NULL
#  raised_count | integer                     | NOT NULL DEFAULT 1
#  created_at   | timestamp without time zone | NOT NULL
#  updated_at   | timestamp without time zone | NOT NULL
# Indexes:
#  errors_pkey              | PRIMARY KEY btree (id)
#  errors_fingerprint_index | UNIQUE btree (fingerprint)
#  errors_subject_gid_index | btree (subject_gid)
