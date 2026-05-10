import UserService from './UserService';
import api from '../api';

// Mock the api module
jest.mock('../api');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch users with pagination', async () => {
      const mockResponseData = {
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'member' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'trainer' },
        ],
        pagination: {
          current_page: 1,
          per_page: 20,
          total_count: 2,
        },
      };

      api.get.mockResolvedValue({ data: mockResponseData });

      const result = await UserService.getUsers(1, 20);

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('/superadmin/users')
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should fetch users with filters', async () => {
      const mockResponseData = {
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'member' },
        ],
        pagination: {
          current_page: 1,
          per_page: 20,
          total_count: 1,
        },
      };

      api.get.mockResolvedValue({ data: mockResponseData });

      const result = await UserService.getUsers(1, 20, { role: 'member' });

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('role=member')
      );
      expect(result).toEqual(mockResponseData);
    });
  });

  describe('getUserById', () => {
    it('should fetch user by ID', async () => {
      const mockResponseData = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'member',
        status: 'active',
      };

      api.get.mockResolvedValue({ data: mockResponseData });

      const result = await UserService.getUserById(1);

      expect(api.get).toHaveBeenCalledWith('/superadmin/users/1');
      expect(result).toEqual(mockResponseData);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        phone: '1234567890',
        role: 'member',
        status: 'active',
      };

      const mockResponseData = {
        id: 3,
        ...userData,
      };

      api.post.mockResolvedValue({ data: mockResponseData });

      const result = await UserService.createUser(userData);

      expect(api.post).toHaveBeenCalledWith('/superadmin/users', userData);
      expect(result).toEqual(mockResponseData);
    });

    it('should handle validation errors', async () => {
      const userData = {
        name: '',
        email: 'invalid-email',
      };

      const mockError = {
        response: {
          data: {
            message: 'Validation failed',
            errors: {
              name: 'Name is required',
              email: 'Invalid email format',
            },
          },
        },
      };

      api.post.mockRejectedValue(mockError);

      await expect(UserService.createUser(userData)).rejects.toEqual(mockError);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const userData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const mockResponseData = {
        id: 1,
        ...userData,
      };

      api.put.mockResolvedValue({ data: mockResponseData });

      const result = await UserService.updateUser(1, userData);

      expect(api.put).toHaveBeenCalledWith('/superadmin/users/1', userData);
      expect(result).toEqual(mockResponseData);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const mockResponseData = {
        message: 'User deleted successfully',
      };

      api.delete.mockResolvedValue({ data: mockResponseData });

      const result = await UserService.deleteUser(1);

      expect(api.delete).toHaveBeenCalledWith('/superadmin/users/1');
      expect(result).toEqual(mockResponseData);
    });
  });

  describe('suspendUser', () => {
    it('should suspend user', async () => {
      const mockResponseData = {
        id: 1,
        status: 'suspended',
      };

      api.post.mockResolvedValue({ data: mockResponseData });

      const result = await UserService.suspendUser(1, 'Violation of terms');

      expect(api.post).toHaveBeenCalledWith(
        '/superadmin/users/1/suspend',
        { reason: 'Violation of terms' }
      );
      expect(result).toEqual(mockResponseData);
    });
  });

  describe('reactivateUser', () => {
    it('should reactivate user', async () => {
      const mockResponseData = {
        id: 1,
        status: 'active',
      };

      api.post.mockResolvedValue({ data: mockResponseData });

      const result = await UserService.reactivateUser(1);

      expect(api.post).toHaveBeenCalledWith('/superadmin/users/1/reactivate', {});
      expect(result).toEqual(mockResponseData);
    });
  });

  describe('searchUsers', () => {
    it('should search users', async () => {
      const mockResponseData = {
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
        ],
        pagination: {
          current_page: 1,
          per_page: 20,
          total_count: 1,
        },
      };

      api.get.mockResolvedValue({ data: mockResponseData });

      const result = await UserService.searchUsers('John', 1, 20);

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('q=John')
      );
      expect(result).toEqual(mockResponseData);
    });
  });
});
