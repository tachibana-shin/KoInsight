import { DB } from './db';
import { Book } from '@koinsight/common/types/book';
import { User } from '@koinsight/common/types/user';

export type Bindings = {
  DATABASE_URL: string;
};

export type Variables = {
  db: DB;
  book?: Book;
  user?: User;
};

export type AppContext = { Bindings: Bindings; Variables: Variables };
