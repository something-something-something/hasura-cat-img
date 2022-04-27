create table profile(
	id serial primary key,
	appuserid integer not null references appuser(id) ,
	description text not null  default '' ,
	name text not null  default '' 
);

create table profilepost(
	id serial primary key,
	profileid integer not null references profile(id) ,
	description text not null default '' ,
	name text not null  default '' ,
	image text not null,
	mimetype text not null,
	created timestamptz not null default now(),
	modified timestamptz not null default now()
);

create function updatemodifiedtimestamp ()
	returns trigger as $$
	BEGIN
	NEW.modified= now();
	return NEW;
	END;
$$ language plpgsql;

create trigger triggerprofilepostmodified 
	after update on profilepost
	for each row
	execute function updatemodifiedtimestamp();

create table profilecomment(
	id serial primary key,
	profileid  integer not null references profile(id) ,
	authorid integer not null references profile(id) ,
	comment text not null  default '' ,
	created timestamptz not null default now(),
	modified timestamptz not null default now()
);

create trigger triggerprofilecommentmodified 
	after update on profilecomment
	for each row
	execute function updatemodifiedtimestamp();

create table profilepostcomment(
	id serial primary key,
	profilepostid  integer not null references profilepost(id) ,
	authorid integer not null references profile(id) ,
	comment text not null  default '' ,
	created timestamptz not null default now(),
	modified timestamptz not null default now()
);

create trigger triggerprofilepostcommentmodified 
	after update on profilepostcomment
	for each row
	execute function updatemodifiedtimestamp();

create table watchprofile(
	id serial primary key,
	appuserid integer not null references appuser(id) ,
	profileid integer not null references profile(id) 
);