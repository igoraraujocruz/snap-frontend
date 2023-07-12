import { useQuery } from 'react-query';
import { api } from '../apiClient';
import { queryClient } from '../queryClient';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  mobilePhone: string;
  createdAt: string;
  updatedAt: string;
  permissions: [
    {
      id: string;
      name: string;
    },
  ];
}

interface CreateUserProps {
  name: string;
  username: string;
  password: string;
  mobilePhone: string;
  email: string;
  permissions: string[];
}

interface UserPermissions {
  userId: string;
  permissions: string[];
}

interface UsersAndQuantityOfUsers {
  users: User[];
  quantityOfUsers: number;
}

export const getUsers = async (
  page: number,
  usersPerPage: number,
): Promise<UsersAndQuantityOfUsers> => {
  const { data } = await api.get(
    `/users?page=${page}&usersPerPage=${usersPerPage}`,
  );

  const { data: total } = await api.get(`/users`);

  const users = data.map((user: User) => {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      mobilePhone: user.mobilePhone,
      permissions: user.permissions,
      createdAt: new Date(user.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
      updatedAt: new Date(user.updatedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
    };
  });

  return { users, quantityOfUsers: total.length };
};

export function useUsers(page: number, usersPerPage: number) {
  return useQuery(['users', page, usersPerPage], () =>
    getUsers(page, usersPerPage),
  );
}

export async function createUser(user: CreateUserProps) {
  await api.post('/users', user);

  queryClient.invalidateQueries('users');
}

export async function deleteUser(userId: string) {
  await api.delete(`/users/${userId}`);

  queryClient.invalidateQueries('users');
}

export async function updateUserPermissions({
  userId,
  permissions,
}: UserPermissions) {
  if (typeof permissions === 'string') {
    await api.patch(`/users/${userId}`, { permissions: [] });
  } else {
    await api.patch(`/users/${userId}`, { permissions });

    queryClient.invalidateQueries('users');
  }
}

export async function resetPassword(
  token: string,
  newPassword: string,
  newPasswordConfirm: string,
) {
  await api.post(`password/reset/${token}`, {
    password: newPassword,
    password_confirmation: newPasswordConfirm,
  });
}
