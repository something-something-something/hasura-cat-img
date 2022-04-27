create trigger triggerprofilepostmodified 
	after update on profilepost
	for each row
	execute function updatemodifiedtimestamp();


create trigger triggerprofilecommentmodified 
	after update on profilecomment
	for each row
	execute function updatemodifiedtimestamp();


create trigger triggerprofilepostcommentmodified 
	after update on profilepostcomment
	for each row
	execute function updatemodifiedtimestamp();
