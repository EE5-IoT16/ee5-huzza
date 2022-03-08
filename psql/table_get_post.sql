SELECT * FROM public."HeartRate";

-- This is how we insert data
insert into public."HeartRate"
("deviceId", bpm, ts)
values (50, 120, '2020-5-5 19:00:00')
returning id

-- This is for deleting all the columns in the table
-- !!!! delete from public."HeartRate" * !!!!

-- This is for reseting the auto increment.
ALTER SEQUENCE "HeartRate_id_seq" RESTART WITH 1;