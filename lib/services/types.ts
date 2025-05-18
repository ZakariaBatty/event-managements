export type Speaker = {
   id: string;
   name: string;
   organization?: string | null;
   bio?: string | null;
   title?: string | null;
   avatar?: string | null;
   createdAt: Date;
   updatedAt: Date;
};
