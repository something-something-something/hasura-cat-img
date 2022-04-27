drop trigger triggerprofilepostmodified on profilepost;
drop trigger  triggerprofilecommentmodified on profilecomment;
 
drop trigger  triggerprofilepostcommentmodified on profilepostcomment;



create trigger triggerprofilepostmodified 
	before update on profilepost
	for each row
	execute function updatemodifiedtimestamp();


create trigger triggerprofilecommentmodified 
	before update on profilecomment
	for each row
	execute function updatemodifiedtimestamp();


create trigger triggerprofilepostcommentmodified 
	before update on profilepostcomment
	for each row
	execute function updatemodifiedtimestamp();
