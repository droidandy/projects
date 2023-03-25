# Sequel::Audited

**sequel-audited** is a [Sequel](http://sequel.jeremyevans.net/) plugin that logs changes made to an
audited model, including who created, updated and destroyed the record, and what was changed
and when the change was made.

This plugin provides model auditing (a.k.a record versioning) for DB scenarios when DB triggers
are not possible. (ie: on a web app on Heroku).


## Disclaimer

This is still **work-in-progress**, and therefore **NOT production ready**, so **use with care**
and test thoroughly before depending upon this gem for mission-critical stuff!
You have been warned! No warranties and guarantees expressed or implied!

<br>

----

<br>

## Installation

### 1) Install the gem

Add this line to your app's Gemfile:


```ruby
gem 'sequel-audited'
```

And then execute:

```bash
$ bundle
```

Or install it yourself as:

```bash
$ gem install sequel-audited
```


### 2)  Generate Migration

In your apps Rakefile add the following:

```ruby
load 'tasks/sequel-audited/migrate.rake'
```

Then verify that the Rake task is available by calling:

```bash
bundle exec rake -T
```

which should output something like this:

```bash
....
rake audited:add_migration      # Installs Sequel::Audited migration, but does not run it.
....
```

Run the sequel-audit rake task:

```bash
bundle exec rake audited:add_migration
```
After this you can comment out the rake task in your Rakefile until you need to update. And then
finally run db:migrate to update your DB.

```bash
bundle exec rake db:migrate
```



### IMPORTANT SIDENOTE!

If you are using PostgreSQL as your database, then it's a good idea to convert the `changed`
column to JSON type for automatic translations into a Ruby hash.

Otherwise, you have to use `JSON.parse(@v.changed)` to convert it to a hash if and when you want
to use it.

<br>

----


<a name="usage"></a>
## Usage


To use audit changes just add plugin to the model.

```ruby
Post.plugin :audited
```

By default this will not audit anything. All audition options shoud be described explicitly.

#### `plugin(:audited, :values => [...])`

```ruby
# Given a Post model with these fields:
    [:id, :category_id, :title, :body, :author_id, :created_at, :updated_at]

# Auditing columns

  plugin :audited, values: [:title, :body, :category_id]

    #=> [:title, :body, :category_id]
    #=> [:id, :author_id, :created_at, :updated_at] # ignored fields
```

#### `plugin(:audited, :many_to_one => [...])`
  If you want to track changes of `many_to_one` associations

```ruby
  plugin :audited, many_to_one: [:category, author: { name: :full_name }]

  # Change category from <Category id: 1, name: "First category"> to <Category id: 3, name: "Trhird category">
  # change user from <Author id: 4, first_name: "John", last_name: "Woo"> to <Author id: 3, first_name: "James", last_name: "Bond">
  # and if Author model has method full_name which concatenates first_name with last_name
  # You get such result

  { associations: {
      category: [{ key: 1, name: "First category" }, { key: 3, name: "Third category" }],
      author:   [{ key: 4, name: "John Woo" }, { key: 2, name: "James Bond" }]
    }
  }
```
Some options to customise associations

```ruby
  plugin :audited, many_to_one: [
    { author: { name: 'name', relation: 'author', class: Author, key: 'autor_id' } }
  ]
```

* **name** - because of object could be deleted later, this field is needed to know where to get name of this object and store it in history
* **relation** - helps you to identify name of relation obviously, for example if Post related with author via user relation
* **class** - name of related class
* **key** - if author related with post with `:user_id` foreign key


#### `plugin(:audited, :many_to_many => [...])`
  If you want to track changes of `many_to_many` relation. It track which objects was added and which was deleted
```ruby
  # posts related to many authors
  class Post
    plugin :association_pks
    plugin :audited, many_to_many: [{ authors: { name: :full_name } }]

    many_to_many :authors, left_key: :post_id, right_key: :author_id, join_table: :authors_posts
  end

  # Post had authors with ids 2, 4. After adding author_pks [1, 3] and removing author with id 2

  =>{ authors: [
        [{key: 2, name: "John Woo"}, {key: 5, name: "James Bond"}],
        [{key: 1, name: "Jim Dough"}, {key: 3, name: "Bob Black"}, {key: 5, name: "James Bond"}]
      ]
    }
```
Customized parameters:
```ruby

  plugin :audited, many_to_many: [
    { authors: { name: 'name', class: Author } }
  ]
```

* **name** - same as with `many_to_ony`
* **class** - name of related class

#### `plugin(:audited, :one_through_one => [...])`
  If you need to track changes of `one_trough_one` relations, this option should be added to join_table model
```ruby
  # User related to one home address,
  class User
    one_through_one :home_address, class: 'Address', join_table: :users_addresses,
    left_key: :user_id, right_key: :address_id
  end

  class UserAddress
    many_to_one :address
    many_to_one :user

    plugin :audited,
      one_through_one: [
        home_address: { target_key: :address_id,
                        target_model: Address,
                        observed_key: :user_id,
                        observed_model: User,
                        name: :city
                      }
      ]
  end
```
After adding new relations to a join table, plugin will try to track change of `home_address` and store it in user.versions
If your user could have multiple addresses and `one_through_one` association, differtiate them by adding some property in join table, you can use :guard option to specify which addresses should be tracked
```ruby
  plugin :audited,
    one_through_one: [
      home_address: { target_key: :address_id,
                      target_model: Address,
                      observed_key: :user_id,
                      observed_model: User,
                      name: :city,
                      guard: { type: 'home' }
                    }
    ]

    # result is

    =>{ associations: {
          home_address: [{ key: 1, name: "London" }, { key: 3, name: "Liverpool" }]
      }}
```

#### `plugin(:audited, :one_to_many => [...])`
If you want to track changes of `one_to_many` relations, this option should be added to model with your target object's id
```ruby
  # user has many addresses
  class User
    one_to_many :addresses
  end

  class Address
    many_to_one :user

    plugin :audited,
      one_to_many: [
        user: { key: :user_id,
                model: User,
                name: :street_name,
                observed_association: :addresses
              }
      ]
  end

  # After add or remove some addresses for user, plugin will track changes with user.versions

   => { addresses: [
          [{key: 1, name: "15 Highway"}],
          [{key: 1, name: "15 Highway"}, {key: 2, name: "19 Jackson Rd."}]
        ]
      }
```

----

<br>

## So what does it do??

You have to look behind the curtain to see what this plugin actually does.

In a new clean DB...

### 1) Create

When you create a new record like this:

```ruby
Category.create(name: 'Sequel')
  #<Category @values={
    :id => 1,
    :name => "Sequel",
    :position => 1
  }>

# in the background a new row in DB[:audit_logs] has been added with the following info:

#<AuditLog @values={
  :id => 1,
  :model_type => "Category",
  :model_pk => 1,
  :event => "create",
  # NOTE! all filled values are stored.
  :changed => "{\"values\":{\"id\":[nil, 1],\"name\":[nil,\"Sequel\"], \"position\": [nil, 1]}}",
  :version => 1,
  :user_id => 88,
  :username => "joeblogs",
  :user_type => "User",
  :created_at => <timestamp>
}>
```

### 2) Updates

When you update a record like this:

```ruby
cat.update(name: 'Ruby Sequel')
  #<Category @values={
    :id => 1,
    :name => "Ruby Sequel",
    :position => 1
  }>

# in the background a new row in DB[:audit_logs] has been added with the following info:

#<AuditLog @values={
  :id => 2,
  :model_type => "Category",
  :model_pk => 1,
  :event => "update",
  # NOTE! only the changes are stored
  :changed => "{\"values\":{\"name\":[\"Sequel\",\"Ruby Sequel\"]}}",
  :version => 2,
  :user_id => 88,
  :username => "joeblogs",
  :user_type => "User",
  :created_at => <timestamp>
}>
```


### 3) Destroys (Deletes)

When you delete a record like this:

```ruby
cat.delete

# TODO Deleting is not tested yet

<br>


<a name="configuration-options"></a>
## Configuration Options

**sequel-audited** supports two forms of configurations:

### A) Global configuration options

#### `Sequel::Audited.audited_current_user_method`

Sets the name of the global method that provides the current user object.
Default is: `:current_user`.

You can easily change the name of this method by calling:

```ruby
Sequel::Audited.audited_current_user_method = :audited_user
```

**Note!** the name of the function must be given as a symbol.

<br>


#### `Sequel::Audited.audited_model_name`

Enables adding your own Audit model. Default is: `:AuditLog`

```ruby
Sequel:: Audited.audited_model_name = :YourCustomModel
```
**Note!** the name of the model must be given as a symbol.
<br>


#### `Sequel::Audited.audited_enabled`

Toggle for enabling / disabling auditing throughout all audited models.
Default is: `true` i.e: enabled.

<br>


### B) Per Audited Model configurations

You can also set these settings on a per model setting by passing the following options:

#### `:user_method => :something`

This option will use a different method for the current user within this model only.

Example:

```ruby
# if you have a global method like
def current_client
  @current_client ||= Client[session[:client_id]]
end

# and set
ClientProfile.plugin(:audited, :user_method => :current_client)

# then the user info will be taken from DB[:clients].
 #<Client @values={:id=>99,:username=>"happyclient"... }>

```

**NOTE!** the current user model must respond to `:id` and `:username` attributes.

----

<br>



## Class Methods

You can easily track all changes made to a model / row / field(s) like this:


### `#.audited_version?`

```ruby
# check if model have any audits (only works on audited models)
Post.audited_versions?
  #=> returns true / false if any audits have been made
```

### `#.audited_version([conditions])`

```ruby
# grab all audits for a particular model. Returns an array.
Post.audited_versions
  #=> [
        { id: 1, model_type: 'Post', model_pk: '11', version: 1,
          changed: "{JSON SERIALIZED OBJECT}", user_id: 88,
          username: "joeblogs", created_at: TIMESTAMP
        },
        {...}
       ]


# filtered by primary_key value
Posts.audited_versions(model_pk: 123)

# filtered by user :id or :username value
Posts.audited_versions(user_id: 88)
Posts.audited_versions(username: 'joeblogs')

# filtered to last two (2) days only
Posts.audited_versions(:created_at < Date.today - 2)

```



2) Track all changes made by a user / user_group.

```ruby
joe = User[88]

joe.audited_versions
  #=> returns all audits made by joe
    ['SELECT * FROM `audit_logs` WHERE user_id = 88 ORDER BY created_at DESC']

joe.audited_versions(:model_type => Post)
  #=> returns all audits made by joe on the Post model
    ['SELECT * FROM `audit_logs` WHERE user_id = 88 AND model_type = 'Post' ORDER BY created_at DESC']
```



## Instance Mehtods

When you active `.plugin(:audited)` in your model, you get these methods:


### `.versions`

```ruby
class Post < Sequel::Model
  plugin :audited   # options here
end

# Returns this post's versions.
post.versions  #=> []
```


### `.blame`
-- aliased as: `.last_audited_by`

```ruby
# Returns the username of the user who last changed the record
post.blame
post.last_audited_by  #=> 'joeblogs'
```


### `.last_audited_at`
-- aliased as: `.last_audited_on`

```ruby
# Returns the timestamp last changed the record
post.last_audited_at
post.last_audited_on  #=> <timestamp>
```


### To be implemented

```ruby
# Returns the post (not a version) as it looked at around the given timestamp.
post.version_at(timestamp)

# Returns the objects (not Versions) as they were between the given times.
post.versions_between(start_time, end_time)

# Returns the post (not a version) as it was most recently.
post.previous_version

# Returns the post (not a version) as it became next.
post.next_version


# Turn Audited on for all posts.
post.audited_on!

# Turn Audited off for all posts.
post.audited_off!
```



<br>

----

<br>


## TODO's

Not everything is perfect or fully formed, so this gem may be in need of the following:

* It needs some **stress testing** and **THREADS support & testing**. Does the gem work in all
  situations / instances?

  I really would appreciate the wisdom of someone with a good understanding of these type of
  things. Please help me ensure it's working great at all times.


* It could probably be cleaned up and made more efficient by a much better programmer than me.
  Please feel free to provide some suggestions or pull-requests.


* Solid **testing and support for more DB's, other than PostgreSQL and SQLite3** currently tested
   against.  Not a priority as I currently have no such requirements. Please feel free to
   submit a pull-request.

* Testing for use with Rails, Sinatra or other Ruby frameworks. I don't see much issues here, but
   I'm NOT bothered to do this testing as [Roda](http://roda.jeremyevans.net/) is my preferred
   Ruby framework. Please feel free to submit a pull-request.

* Support for `:on => [:create, :update]` option to limit auditing to only some actions. Not sure
   if this is really worthwhile, but could be added as a feature. Please feel free to submit a
   pull-request.

* Support for sweeping (compacting) old updates if there are too many. Not sure how to handle this.
  Suggestions and ideas are most welcome.

  I think a simple cron job could extract all records with `event: 'update'` older than a specific
  time period (3 - 6 months) and dump them into something else, instead of adding this feature.

  If you are running this on a free app on Heroku, with many and frequent updates, you might want
  to pay attention to this functionality as there's a 10,000 rows limit on Heroku.




## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake test` to run
the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version,
update the version number in `version.rb`, and then run `bundle exec rake release`, which will create
a git tag for the version, push git commits and tags, and push the `.gem` file to
[rubygems.org](https://rubygems.org).



## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/kematzy/sequel-audited.

Please run `bundle exec rake coverage` and `bundle exec rake rubocop` on your code before you
send a pull-request.


This project is intended to be a safe, welcoming space for collaboration, and contributors are
expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

© Copyright Kematzy, 2015

Heavily inspired by:

* the [audited](https://github.com/collectiveidea/audited) gem by Brandon Keepers, Kenneth Kalmer,
  Daniel Morrison, Brian Ryckbost, Steve Richert & Ryan Glover released under the MIT licence.

* the [paper_trail](https://github.com/airblade/paper_trail) gem by Andy Stewart & Ben Atkins
  released under the MIT license.

* the [sequel](https://github.com/jeremyevans/sequel) gem by Jeremy Evans and many others released
   under the MIT license.

The gem is available as open source under the terms of the
[MIT License](http://opensource.org/licenses/MIT).

