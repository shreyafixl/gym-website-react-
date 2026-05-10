import DashboardService from './DashboardService';
import api from '../api';

// Mock the api module
jest.mock('../api');

describe('DashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverview', () => {
    it('should fetch dashboard overview successfully', async () => {
      const mockResponseData = {
        totalUsers: 150,
        activeMembers: 120,
        totalRevenue: 50000,
        totalBranches: 5,
      };

      api.get.mockResolvedValue({ data: mockResponseData });

      const result = await DashboardService.getOverview();

      expect(api.get).toHaveBeenCalledWith('/superadmin/dashboard/overview');
      expect(result).toEqual(mockResponseData);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      api.get.mockRejectedValue(mockError);

      await expect(DashboardService.getOverview()).rejects.toThrow('API Error');
    });
  });

  describe('getStatistics', () => {
    it('should fetch statistics with date range', async () => {
      const mockResponseData = {
        statistics: {
          totalUsers: 150,
          activeMembers: 120,
        },
      };

      api.get.mockResolvedValue({ data: mockResponseData });

      const result = await DashboardService.getStatistics('2024-01-01', '2024-12-31');

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('/superadmin/dashboard/statistics')
      );
      expect(result).toEqual(mockResponseData);
    });
  });

  describe('getMetrics', () => {
    it('should fetch real-time metrics', async () => {
      const mockResponseData = {
        cpuUsage: 45,
        memoryUsage: 60,
        activeConnections: 25,
      };

      api.get.mockResolvedValue({ data: mockResponseData });

      const result = await DashboardService.getMetrics();

      expect(api.get).toHaveBeenCalledWith('/superadmin/dashboard/metrics');
      expect(result).toEqual(mockResponseData);
    });
  });

  describe('getActivityFeed', () => {
    it('should fetch activity feed with limit', async () => {
      const mockResponseData = {
        activities: [
          { id: 1, action: 'User created', timestamp: '2024-01-01' },
          { id: 2, action: 'User updated', timestamp: '2024-01-02' },
        ],
      };

      api.get.mockResolvedValue({ data: mockResponseData });

      const result = await DashboardService.getActivityFeed(10);

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('/superadmin/dashboard/activity')
      );
      expect(result).toEqual(mockResponseData);
    });
  });
});
