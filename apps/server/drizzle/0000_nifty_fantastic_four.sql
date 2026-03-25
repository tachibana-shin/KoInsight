CREATE TABLE "annotation" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_md5" varchar(32) NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"annotation_type" varchar(20) NOT NULL,
	"text" text,
	"note" text,
	"drawer" varchar(50),
	"color" varchar(50),
	"chapter" text,
	"pageno" integer,
	"page_ref" text NOT NULL,
	"pos0" text,
	"pos1" text,
	"datetime" varchar(255) NOT NULL,
	"datetime_updated" varchar(255),
	"total_pages" integer DEFAULT 0,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "annotation_book_md5_device_id_page_ref_datetime_unique" UNIQUE("book_md5","device_id","page_ref","datetime")
);
--> statement-breakpoint
CREATE TABLE "book" (
	"id" serial PRIMARY KEY NOT NULL,
	"md5" varchar(32) NOT NULL,
	"title" varchar(255),
	"authors" varchar(255),
	"notes" integer DEFAULT 0,
	"last_open" integer DEFAULT 0,
	"highlights" integer DEFAULT 0,
	"pages" integer DEFAULT 0,
	"series" varchar(255),
	"language" varchar(255),
	"total_read_time" integer DEFAULT 0,
	"total_read_pages" integer DEFAULT 0,
	"soft_deleted_at" timestamp,
	"reference_pages" integer DEFAULT 0,
	"cover_url" text,
	CONSTRAINT "book_md5_unique" UNIQUE("md5")
);
--> statement-breakpoint
CREATE TABLE "book_device" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_md5" varchar(32) NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"last_open" integer DEFAULT 0,
	"pages" integer DEFAULT 0,
	"notes" integer DEFAULT 0,
	"highlights" integer DEFAULT 0,
	"total_read_pages" integer DEFAULT 0,
	"total_read_time" integer DEFAULT 0,
	CONSTRAINT "book_device_book_md5_device_id_unique" UNIQUE("book_md5","device_id")
);
--> statement-breakpoint
CREATE TABLE "book_genre" (
	"book_md5" varchar(32) NOT NULL,
	"genre_id" integer NOT NULL,
	CONSTRAINT "book_genre_book_md5_genre_id_unique" UNIQUE("book_md5","genre_id")
);
--> statement-breakpoint
CREATE TABLE "device" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"model" text
);
--> statement-breakpoint
CREATE TABLE "genre" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "genre_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "page_stat" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_md5" varchar(32) NOT NULL,
	"device_id" varchar(255),
	"page" integer NOT NULL,
	"duration" double precision NOT NULL,
	"total_pages" integer NOT NULL,
	"start_time" integer NOT NULL,
	CONSTRAINT "page_stat_book_md5_device_id_page_start_time_unique" UNIQUE("book_md5","device_id","page","start_time")
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"document" varchar(255) NOT NULL,
	"progress" varchar(255) NOT NULL,
	"percentage" double precision NOT NULL,
	"device" varchar(255) NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "progress_user_id_document_device_id_unique" UNIQUE("user_id","document","device_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "annotation" ADD CONSTRAINT "annotation_book_md5_book_md5_fk" FOREIGN KEY ("book_md5") REFERENCES "public"."book"("md5") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "annotation" ADD CONSTRAINT "annotation_device_id_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."device"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_device" ADD CONSTRAINT "book_device_book_md5_book_md5_fk" FOREIGN KEY ("book_md5") REFERENCES "public"."book"("md5") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_device" ADD CONSTRAINT "book_device_device_id_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."device"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_genre" ADD CONSTRAINT "book_genre_genre_id_genre_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genre"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_genre" ADD CONSTRAINT "book_genre_book_md5_book_md5_fk" FOREIGN KEY ("book_md5") REFERENCES "public"."book"("md5") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_stat" ADD CONSTRAINT "page_stat_book_md5_book_md5_fk" FOREIGN KEY ("book_md5") REFERENCES "public"."book"("md5") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_stat" ADD CONSTRAINT "page_stat_device_id_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."device"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_annotation_deleted_at" ON "annotation" USING btree ("deleted_at") WHERE deleted_at IS NOT NULL;