## Installation

Create migration:

```ruby
Sequel.migration do
  up do
    create_table(:audit_logs) do
      primary_key :id
      String   :model_type
      Integer  :model_pk
      String   :model_ref
      String   :event
      String   :changed,     text: true
      Integer  :version,     default: 0
      Integer  :user_id
      String   :username
      Integer  :original_user_id
      String   :original_username
      DateTime :created_at
    end
  end

  down do
    drop_table :audit_logs
  end
end

```

### IMPORTANT SIDENOTE!

If you are using PostgreSQL as your database, then it's a good idea to convert the `changed`
column to JSON type for automatic translations into a Ruby hash.

Otherwise, you have to use `JSON.parse(@v.changed)` to convert it to a hash if and when you want
to use it.

----

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
If your user could have multiple addresses and `one_through_one` association, differtiate them by adding some property in join table,
you can use :only option to specify which addresses should be tracked
```ruby
  plugin :audited,
    one_through_one: [
      home_address: { target_key: :address_id,
                      target_model: Address,
                      observed_key: :user_id,
                      observed_model: User,
                      name: :city,
                      only: -> (user_address) { user_address.type != 'home' }
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
Posts.audited_versions(:created_at < Date.current - 2)

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
