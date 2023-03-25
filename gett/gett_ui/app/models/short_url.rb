class ShortUrl < Sequel::Model
  plugin :application_model

  def before_validation
    super
    generate_token
  end

  def validate
    super
    validates_presence [:original_url, :token]
  end

  def self.generate(url_or_path)
    unless url_or_path =~ %r{^https?://}
      url_or_path = host + (url_or_path.starts_with?('/') ? '' : '/') << url_or_path
    end

    short_url = find_or_create(original_url: url_or_path)

    "#{host}/s/#{short_url.token}"
  rescue Sequel::UniqueConstraintViolation => error
    # if two processes tried to simultaneously `find_or_create` short url by `original_url`, for
    # new `original_url`, one of them will fail. simple retry will do the trick, since at this
    # point the record is known to be in DB, i.e. `find_or_create` will fetch it on retry
    retry if error.message =~ /original_url/
    raise
  end

  def self.host
    Rails.application.config.action_mailer.default_url_options[:host]
  end
  private_class_method :host

  private def generate_token
    return if token.present?

    loop do
      self.token = SecureRandom.hex(6)
      break if ShortUrl.where(token: token).empty?
    end
  end
end

# Table: short_urls
# Columns:
#  id           | integer                     | PRIMARY KEY DEFAULT nextval('short_urls_id_seq'::regclass)
#  original_url | text                        | NOT NULL
#  token        | text                        | NOT NULL
#  created_at   | timestamp without time zone | NOT NULL
#  updated_at   | timestamp without time zone | NOT NULL
# Indexes:
#  short_urls_pkey               | PRIMARY KEY btree (id)
#  short_urls_original_url_key   | UNIQUE btree (original_url)
#  short_urls_token_key          | UNIQUE btree (token)
#  short_urls_original_url_index | btree (original_url)
#  short_urls_token_index        | btree (token)
