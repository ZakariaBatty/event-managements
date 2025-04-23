import { userRepository } from '../repositories/base-repository';

export const userService = {
   async getUsers(page = 1, limit = 10) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
         userRepository.findAll({
            skip,
            take: limit,
            orderBy: {
               createdAt: 'desc',
            },
         }),
         userRepository.count(),
      ]);

      return {
         data,
         meta: {
            total,
            page,
            limit,
            pageCount: Math.ceil(total / limit),
         },
      };
   },
   async getUser(id: string) {
      return userRepository.findById(id);
   },

   async createUser(data: any) {
      return userRepository.create(data);
   },

   async updateUser(id: string, data: any) {
      return userRepository.update(id, data);
   },

   async deleteUser(id: string) {
      return userRepository.delete(id);
   },
};
