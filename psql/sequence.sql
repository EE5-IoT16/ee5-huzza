SELECT * FROM public."UserPhysicalData";

CREATE SEQUENCE "UserPhysicalData_id_seq"
	INCREMENT 1
	MINVALUE 0
	MAXVALUE 2147483647
	CACHE 1;

-- Selects all sequences
SELECT c.relname FROM pg_class c WHERE c.relkind = 'S';

-- Add auto-increment to the id column
ALTER TABLE public."UserPhysicalData" ALTER COLUMN "id" SET DEFAULT nextval('"UserPhysicalData_id_seq"'::regclass);

-- Change the name of the sequence
ALTER SEQUENCE "Gyroscope_id_seq" RENAME TO "Falls_id_seq";

-- Drop sequence
DROP SEQUENCE "UserPhysicalData_id_seq";

ALTER TABLE public."Activities" ALTER COLUMN id SET DEFAULT 0;