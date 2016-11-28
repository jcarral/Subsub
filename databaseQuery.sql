CREATE DATABASE IF NOT EXISTS subsub;

CREATE TABLE users(
  id int(255) auto_increment not null,
  name varchar(120) not null,
  mail varchar(120) not null,
  pass varchar(120) not null,
  avatar varchar(255),
  role varchar(120),
  status varchar(120),
  constraint pk_users PRIMARY KEY (id)
)ENGINE=InnoDB;

CREATE TABLE tags(
  id int(255) auto_increment not null,
  name varchar(120) not null,
  constraint pk_tags PRIMARY KEY (id)
)ENGINE=InnoDB;

CREATE TABLE posts(
  id int(255) auto_increment not null,
  author_id int(255) not null,
  title varchar(255) not null,
  description text,
  image varchar(255) not null,
  insertedDate DATE,
  updatedDate DATE,
  status varchar(120),
  location varchar(120),
  type varchar(120),
  constraint pk_posts PRIMARY KEY (id),
  constraint fk_post_users foreign key(author_id) references users(id)
)ENGINE=InnoDB;

CREATE TABLE posts_tags(
  id int(255) auto_increment not null,
  post_id int(255) not null,
  tag_id int(255) not null,
  constraint pk_posts_tags PRIMARY KEY (id),
  constraint fk_posttags_post foreign key(post_id) references posts(id),
  constraint fk_posttags_tag foreign key(tag_id) references tag(id),
)ENGINE=InnoDB;

CREATE TABLE followers(
  id int(255) auto_increment not null,
  user_id int(255) not null,
  follower_id int(255) not null,
  constraint fk_followers_follower foreign key(follower_id) references users(id),
  constraint fk_followers_user foreign key(user_id) references users(id),
  constraint pk_followers PRIMARY KEY (id)
)ENGINE=InnoDB;

CREATE TABLE favs(
  id int(255) auto_increment not null,
  post_id int(255) not null,
  user_id int(255) not null,
  constraint fk_favs_post foreign key(post_id) references posts(id),
  constraint fk_favs_user foreign key(user_id) references users(id),
  constraint pk_favs PRIMARY KEY (id)
)ENGINE=InnoDB;

CREATE TABLE ratings(
  id int(255) auto_increment not null,
  points int(255),
  insertedDate DATE,
  post_id int(255) not null,
  user_id int(255) not null,
  constraint fk_ratings_post foreign key(post_id) references posts(id),
  constraint fk_ratings_user foreign key(user_id) references users(id),
  constraint pk_ratings PRIMARY KEY (id)
)ENGINE=InnoDB;

CREATE TABLE comments(
  id int(255) auto_increment not null,
  title varchar(255),
  content text,
  insertedDate DATE,
  user_id int(255) not null,
  post_id int(255) not null,
  constraint fk_user foreign key(user_id) references users(id),
  constraint fk_post foreign key(post_id) references posts(id),
  constraint pk_comments PRIMARY KEY (id)
)ENGINE=InnoDB;
