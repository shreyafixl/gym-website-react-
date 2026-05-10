/**
 * Service Tests
 * Tests for API service methods and data handling
 */

import axios from 'axios';

jest.mock('axios');

// Mock service methods
const DashboardService = {
  getOverview: async () => {
    const response = await axios.get('/api/superadmin/dashboard/overview');
    return response.data.data;
  },
};

const UserService = {
  getUsers: async (page = 1, perPage = 20, filters = {}) => {
    const response = await axios.get('/api/superadmin/users', {
      params: { page, per_page: perPage, ...filters },
    });
    return response.data.data;
  },

  createUser: async (userData) => {
    const response = await axios.post('/api/superadmin/users', userData);
    return response.data.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axios.put(`/api/superadmin/users/${userId}`, userData);
    return response.data.data;
  },

  deleteUser: async (userId) => {
    const response = await axios.delete(`/api/superadmin/users/${userId}`);
    return response.data.data;
  },

  suspendUser: async (userId, reason) => {
    const response = await axios.post(`/api/superadmin/users/${userId}/suspend`, { reason });
    return response.data.data;
  },

  reactivateUser: async (userId) => {
    const response = await axios.post(`/api/superadmin/users/${userId}/reactivate`);
    return response.data.data;
  },

  resetPassword: async (userId, newPassword) => {
    const response = await axios.post(`/api/superadmin/users/${userId}/reset-password`, {
      newPassword,
    });
    return response.data.data;
  },

  getUserActivity: async (userId) => {
    const response = await axios.get(`/api/superadmin/users/${userId}/activity`);
    return response.data.data;
  },

  bulkImportUsers: async (users) => {
    const response = await axios.post('/api/superadmin/users/bulk-import', { users });
    return response.data.data;
  },

  exportUsers: async (format = 'json', filters = {}) => {
    const response = await axios.get('/api/superadmin/users/export', {
      params: { format, ...filters },
    });
    return response.data.data;
  },
};

describe('Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DashboardService', () => {
    test('should fetch dashboard overview', async () => {
      const mockData = {
        totalUsers: 100,
        activeMembers: 50,
        totalRevenue: 5000,
        totalBranches: 3,
      };

      axios.get.mockResolvedValue({
        data: { data: mockData },
      });

      const result = await DashboardService.getOverview();

      expect(result).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith('/api/superadmin/dashboard/overview');
    });

    test('should handle dashboard fetch error', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      await expect(DashboardService.getOverview()).rejects.toThrow('API Error');
    });
  });

  describe('UserService', () => {
    describe('getUsers', () => {
      test('should fetch users with pagination', async () => {
        const mockUsers = [
          { id: 1, fullName: 'User 1', email: 'user1@test.com' },
          { id: 2, fullName: 'User 2', email: 'user2@test.com' },
        ];

        axios.get.mockResolvedValue({
          data: {
            data: {
              users: mockUsers,
              pagination: { current_page: 1, per_page: 20, total_pages: 5, total_count: 100 },
            },
          },
        });

        const result = await UserService.getUsers(1, 20);

        expect(result.users).toEqual(mockUsers);
        expect(result.pagination.current_page).toBe(1);
        expect(axios.get).toHaveBeenCalledWith('/api/superadmin/users', {
          params: { page: 1, per_page: 20 },
        });
      });

      test('should fetch users with filters', async () => {
        const mockUsers = [{ id: 1, fullName: 'Trainer 1', role: 'trainer' }];

        axios.get.mockResolvedValue({
          data: { data: { users: mockUsers } },
        });

        const result = await UserService.getUsers(1, 20, { role: 'trainer' });

        expect(result.users).toEqual(mockUsers);
        expect(axios.get).toHaveBeenCalledWith('/api/superadmin/users', {
          params: { page: 1, per_page: 20, role: 'trainer' },
        });
      });

      test('should fetch users with search', async () => {
        const mockUsers = [{ id: 1, fullName: 'John Doe', email: 'john@test.com' }];

        axios.get.mockResolvedValue({
          data: { data: { users: mockUsers } },
        });

        const result = await UserService.getUsers(1, 20, { search: 'John' });

        expect(result.users).toEqual(mockUsers);
        expect(axios.get).toHaveBeenCalledWith('/api/superadmin/users', {
          params: { page: 1, per_page: 20, search: 'John' },
        });
      });
    });

    describe('createUser', () => {
      test('should create a new user', async () => {
        const userData = {
          fullName: 'New User',
          email: 'newuser@test.com',
          password: 'SecurePass123',
          phone: '1234567890',
          gender: 'male',
          age: 25,
        };

        const mockResponse = { id: 1, ...userData };

        axios.post.mockResolvedValue({
          data: { data: { user: mockResponse } },
        });

        const result = await UserService.createUser(userData);

        expect(result.user).toEqual(mockResponse);
        expect(axios.post).toHaveBeenCalledWith('/api/superadmin/users', userData);
      });

      test('should handle user creation error', async () => {
        const userData = { fullName: 'User' };

        axios.post.mockRejectedValue(new Error('Validation Error'));

        await expect(UserService.createUser(userData)).rejects.toThrow('Validation Error');
      });
    });

    describe('updateUser', () => {
      test('should update user information', async () => {
        const userId = '123';
        const updateData = { fullName: 'Updated Name', age: 30 };
        const mockResponse = { id: userId, ...updateData };

        axios.put.mockResolvedValue({
          data: { data: { user: mockResponse } },
        });

        const result = await UserService.updateUser(userId, updateData);

        expect(result.user).toEqual(mockResponse);
        expect(axios.put).toHaveBeenCalledWith(`/api/superadmin/users/${userId}`, updateData);
      });
    });

    describe('deleteUser', () => {
      test('should delete a user', async () => {
        const userId = '123';

        axios.delete.mockResolvedValue({
          data: { data: { userId } },
        });

        const result = await UserService.deleteUser(userId);

        expect(result.userId).toBe(userId);
        expect(axios.delete).toHaveBeenCalledWith(`/api/superadmin/users/${userId}`);
      });
    });

    describe('suspendUser', () => {
      test('should suspend a user', async () => {
        const userId = '123';
        const reason = 'Violation of terms';

        axios.post.mockResolvedValue({
          data: { data: { userId } },
        });

        const result = await UserService.suspendUser(userId, reason);

        expect(result.userId).toBe(userId);
        expect(axios.post).toHaveBeenCalledWith(`/api/superadmin/users/${userId}/suspend`, {
          reason,
        });
      });
    });

    describe('reactivateUser', () => {
      test('should reactivate a user', async () => {
        const userId = '123';

        axios.post.mockResolvedValue({
          data: { data: { userId } },
        });

        const result = await UserService.reactivateUser(userId);

        expect(result.userId).toBe(userId);
        expect(axios.post).toHaveBeenCalledWith(`/api/superadmin/users/${userId}/reactivate`);
      });
    });

    describe('resetPassword', () => {
      test('should reset user password', async () => {
        const userId = '123';
        const newPassword = 'NewSecurePass123';

        axios.post.mockResolvedValue({
          data: { data: { userId } },
        });

        const result = await UserService.resetPassword(userId, newPassword);

        expect(result.userId).toBe(userId);
        expect(axios.post).toHaveBeenCalledWith(`/api/superadmin/users/${userId}/reset-password`, {
          newPassword,
        });
      });
    });

    describe('getUserActivity', () => {
      test('should fetch user activity', async () => {
        const userId = '123';
        const mockActivity = {
          userId,
          fullName: 'User Name',
          email: 'user@test.com',
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
        };

        axios.get.mockResolvedValue({
          data: { data: mockActivity },
        });

        const result = await UserService.getUserActivity(userId);

        expect(result).toEqual(mockActivity);
        expect(axios.get).toHaveBeenCalledWith(`/api/superadmin/users/${userId}/activity`);
      });
    });

    describe('bulkImportUsers', () => {
      test('should bulk import users', async () => {
        const users = [
          { fullName: 'User 1', email: 'user1@test.com', password: 'Pass123', phone: '1111111111' },
          { fullName: 'User 2', email: 'user2@test.com', password: 'Pass123', phone: '2222222222' },
        ];

        const mockResponse = {
          successful: 2,
          failed: 0,
          errors: [],
        };

        axios.post.mockResolvedValue({
          data: { data: mockResponse },
        });

        const result = await UserService.bulkImportUsers(users);

        expect(result.successful).toBe(2);
        expect(result.failed).toBe(0);
        expect(axios.post).toHaveBeenCalledWith('/api/superadmin/users/bulk-import', { users });
      });

      test('should handle bulk import with errors', async () => {
        const users = [
          { fullName: 'User 1', email: 'user1@test.com', password: 'Pass123', phone: '1111111111' },
          { fullName: 'User 2', email: 'duplicate@test.com', password: 'Pass123', phone: '2222222222' },
        ];

        const mockResponse = {
          successful: 1,
          failed: 1,
          errors: [{ row: 2, error: 'Duplicate email' }],
        };

        axios.post.mockResolvedValue({
          data: { data: mockResponse },
        });

        const result = await UserService.bulkImportUsers(users);

        expect(result.successful).toBe(1);
        expect(result.failed).toBe(1);
        expect(result.errors.length).toBe(1);
      });
    });

    describe('exportUsers', () => {
      test('should export users in JSON format', async () => {
        const mockUsers = [
          { id: 1, fullName: 'User 1', email: 'user1@test.com' },
          { id: 2, fullName: 'User 2', email: 'user2@test.com' },
        ];

        axios.get.mockResolvedValue({
          data: { data: { users: mockUsers, count: 2 } },
        });

        const result = await UserService.exportUsers('json');

        expect(result.users).toEqual(mockUsers);
        expect(result.count).toBe(2);
        expect(axios.get).toHaveBeenCalledWith('/api/superadmin/users/export', {
          params: { format: 'json' },
        });
      });

      test('should export users with filters', async () => {
        const mockUsers = [{ id: 1, fullName: 'Trainer 1', role: 'trainer' }];

        axios.get.mockResolvedValue({
          data: { data: { users: mockUsers, count: 1 } },
        });

        const result = await UserService.exportUsers('json', { role: 'trainer' });

        expect(result.users).toEqual(mockUsers);
        expect(axios.get).toHaveBeenCalledWith('/api/superadmin/users/export', {
          params: { format: 'json', role: 'trainer' },
        });
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(DashboardService.getOverview()).rejects.toThrow('Network Error');
    });

    test('should handle API errors', async () => {
      axios.post.mockRejectedValue({
        response: { status: 400, data: { error: 'Bad Request' } },
      });

      await expect(UserService.createUser({})).rejects.toThrow();
    });

    test('should handle timeout errors', async () => {
      axios.get.mockRejectedValue(new Error('Timeout'));

      await expect(DashboardService.getOverview()).rejects.toThrow('Timeout');
    });
  });

  describe('Response Parsing', () => {
    test('should parse dashboard response correctly', async () => {
      const mockData = {
        totalUsers: 100,
        activeMembers: 50,
        totalRevenue: 5000,
        totalBranches: 3,
        membershipStats: { active: 50, expired: 30, pending: 20 },
      };

      axios.get.mockResolvedValue({
        data: { data: mockData },
      });

      const result = await DashboardService.getOverview();

      expect(result.totalUsers).toBe(100);
      expect(result.activeMembers).toBe(50);
      expect(result.totalRevenue).toBe(5000);
      expect(result.totalBranches).toBe(3);
      expect(result.membershipStats).toBeDefined();
    });

    test('should parse user list response correctly', async () => {
      const mockResponse = {
        users: [
          { id: 1, fullName: 'User 1', email: 'user1@test.com', role: 'member' },
        ],
        pagination: {
          current_page: 1,
          per_page: 20,
          total_pages: 5,
          total_count: 100,
        },
      };

      axios.get.mockResolvedValue({
        data: { data: mockResponse },
      });

      const result = await UserService.getUsers();

      expect(result.users).toBeDefined();
      expect(result.pagination).toBeDefined();
      expect(result.pagination.current_page).toBe(1);
      expect(result.pagination.total_count).toBe(100);
    });
  });
});
