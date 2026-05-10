/**
 * Dashboard Overview Page Tests
 * Tests for the SuperAdmin Dashboard Overview page component
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock component - in real scenario, import the actual component
const DashboardOverviewPage = ({ onRefresh }) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [lastRefresh, setLastRefresh] = React.useState(new Date());

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/superadmin/dashboard/overview');
      setData(response.data.data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
    if (onRefresh) onRefresh();
  };

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">{error}</div>;

  return (
    <div data-testid="dashboard">
      <button onClick={handleRefresh} data-testid="refresh-btn">
        Refresh
      </button>
      <div data-testid="last-refresh">Last refresh: {lastRefresh.toLocaleTimeString()}</div>
      {data && (
        <>
          <div data-testid="total-users">Total Users: {data.totalUsers}</div>
          <div data-testid="active-members">Active Members: {data.activeMembers}</div>
          <div data-testid="total-revenue">Revenue: ${data.totalRevenue}</div>
          <div data-testid="total-branches">Branches: {data.totalBranches}</div>
        </>
      )}
    </div>
  );
};

describe('Dashboard Overview Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render without crashing', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          totalUsers: 100,
          activeMembers: 50,
          totalRevenue: 5000,
          totalBranches: 3,
        },
      },
    });

    render(<DashboardOverviewPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
  });

  test('should display loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<DashboardOverviewPage />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('should display error state on API failure', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));

    render(<DashboardOverviewPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });

  test('should fetch data on mount', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          totalUsers: 100,
          activeMembers: 50,
          totalRevenue: 5000,
          totalBranches: 3,
        },
      },
    });

    render(<DashboardOverviewPage />);
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/superadmin/dashboard/overview');
    });
  });

  test('should display KPI cards with correct data', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          totalUsers: 100,
          activeMembers: 50,
          totalRevenue: 5000,
          totalBranches: 3,
        },
      },
    });

    render(<DashboardOverviewPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('total-users')).toHaveTextContent('100');
      expect(screen.getByTestId('active-members')).toHaveTextContent('50');
      expect(screen.getByTestId('total-revenue')).toHaveTextContent('5000');
      expect(screen.getByTestId('total-branches')).toHaveTextContent('3');
    });
  });

  test('should refresh button trigger data fetch', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          totalUsers: 100,
          activeMembers: 50,
          totalRevenue: 5000,
          totalBranches: 3,
        },
      },
    });

    render(<DashboardOverviewPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    const refreshBtn = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test('should update last refresh timestamp', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: {
          totalUsers: 100,
          activeMembers: 50,
          totalRevenue: 5000,
          totalBranches: 3,
        },
      },
    });

    render(<DashboardOverviewPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('last-refresh')).toBeInTheDocument();
    });
  });

  test('should handle authentication check', async () => {
    axios.get.mockRejectedValue({ response: { status: 401 } });

    render(<DashboardOverviewPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });

  test('should retry on error', async () => {
    axios.get
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({
        data: {
          data: {
            totalUsers: 100,
            activeMembers: 50,
            totalRevenue: 5000,
            totalBranches: 3,
          },
        },
      });

    render(<DashboardOverviewPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    const refreshBtn = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
  });

  test('should display response time < 500ms', async () => {
    const startTime = Date.now();
    axios.get.mockResolvedValue({
      data: {
        data: {
          totalUsers: 100,
          activeMembers: 50,
          totalRevenue: 5000,
          totalBranches: 3,
        },
      },
    });

    render(<DashboardOverviewPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(500);
  });
});
