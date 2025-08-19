import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { getClientContractsAction } from '../contract.actions';

// Mock Prisma
const mockPrisma = {
  contract: {
    findMany: jest.fn(),
  },
};

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

describe('getClientContractsAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when no contracts exist', async () => {
    mockPrisma.contract.findMany.mockResolvedValue([]);

    const result = await getClientContractsAction('client-123');

    expect(result.success).toBe(true);
    expect(result.data).toBe(null);
    expect(result.message).toBe('Aucun contrat trouvé');
  });

  it('should return active contract when one exists', async () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30); // 30 jours ago
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30); // 30 jours from now

    const mockContracts = [
      {
        id: 'contract-1',
        startDate: startDate,
        endDate: endDate,
        totalSessions: 12,
        amount: 299.99,
        offer: {
          program: {
            name: 'Programme Fitness',
            type: 'PERSONAL',
          },
          price: 299.99,
          duration: 3,
        },
      },
    ];

    mockPrisma.contract.findMany.mockResolvedValue(mockContracts);

    const result = await getClientContractsAction('client-123');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockContracts[0]);
    expect(result.type).toBe('active');
    expect(result.message).toBe('Contrat en cours');
  });

  it('should return future contract when no active contract exists', async () => {
    const today = new Date();
    const futureStartDate1 = new Date(today);
    futureStartDate1.setDate(today.getDate() + 10); // 10 jours from now
    const futureStartDate2 = new Date(today);
    futureStartDate2.setDate(today.getDate() + 5); // 5 jours from now (plus proche)

    const mockContracts = [
      {
        id: 'contract-1',
        startDate: futureStartDate1,
        endDate: new Date(futureStartDate1.getTime() + 90 * 24 * 60 * 60 * 1000),
        totalSessions: 12,
        amount: 299.99,
        offer: {
          program: {
            name: 'Programme Fitness',
            type: 'PERSONAL',
          },
          price: 299.99,
          duration: 3,
        },
      },
      {
        id: 'contract-2',
        startDate: futureStartDate2,
        endDate: new Date(futureStartDate2.getTime() + 90 * 24 * 60 * 60 * 1000),
        totalSessions: 8,
        amount: 199.99,
        offer: {
          program: {
            name: 'Programme Fitness',
            type: 'SMALL_GROUP',
          },
          price: 199.99,
          duration: 2,
        },
      },
    ];

    mockPrisma.contract.findMany.mockResolvedValue(mockContracts);

    const result = await getClientContractsAction('client-123');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockContracts[1]); // contract-2 (plus proche)
    expect(result.type).toBe('future');
    expect(result.message).toBe('Contrat futur');
  });

  it('should return null when only past contracts exist', async () => {
    const today = new Date();
    const pastStartDate = new Date(today);
    pastStartDate.setDate(today.getDate() - 60); // 60 jours ago
    const pastEndDate = new Date(today);
    pastEndDate.setDate(today.getDate() - 30); // 30 jours ago

    const mockContracts = [
      {
        id: 'contract-1',
        startDate: pastStartDate,
        endDate: pastEndDate,
        totalSessions: 12,
        amount: 299.99,
        offer: {
          program: {
            name: 'Programme Fitness',
            type: 'PERSONAL',
          },
          price: 299.99,
          duration: 3,
        },
      },
    ];

    mockPrisma.contract.findMany.mockResolvedValue(mockContracts);

    const result = await getClientContractsAction('client-123');

    expect(result.success).toBe(true);
    expect(result.data).toBe(null);
    expect(result.message).toBe('Aucun contrat actif ou futur');
  });

  it('should handle database errors gracefully', async () => {
    mockPrisma.contract.findMany.mockRejectedValue(new Error('Database connection failed'));

    const result = await getClientContractsAction('client-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Database connection failed');
  });
});
